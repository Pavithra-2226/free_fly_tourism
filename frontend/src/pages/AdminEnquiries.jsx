import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../api/enquiries.js";
import {
  fetchNotifications,
  markNotificationRead,
} from "../api/notifications.js";
import { logoutAdmin } from "../api/auth.js";
import { useEarlyBird } from "../hooks/useEarlyBird.js";
import Countdown from "../components/Countdown.jsx";
import {
  STATUS_OPTIONS,
  STATUS_STYLES,
  formatDateRange,
  formatPrice,
} from "../utils/adminFormat.js";

export default function AdminEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selected, setSelected] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live Early Bird information
  const {
    earlyBird,
    refresh: refreshEarlyBird,
  } = useEarlyBird();

  function handleUnauthorized() {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }

  async function loadEnquiries() {
    setLoading(true);
    setError("");

    const result = await fetchEnquiries();

    if (result.unauthorized) {
      handleUnauthorized();
      return;
    }

    if (result.success) {
      setEnquiries(result.enquiries);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  async function loadNotifications() {
    const result = await fetchNotifications();

    if (result.unauthorized) {
      handleUnauthorized();
      return;
    }

    if (result.success) {
      setNotifications(result.notifications);
    }
  }

  useEffect(() => {
    loadEnquiries();
    loadNotifications();
  }, []);

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    setError("");

    const result = await updateEnquiryStatus(id, status);

    if (result.unauthorized) {
      handleUnauthorized();
      return;
    }

    if (result.success) {
      // Reload so offer type, price and Early Bird count stay accurate.
      await loadEnquiries();
      await refreshEarlyBird();

      // If the currently opened enquiry was updated, refresh its details too.
      setSelected((current) => {
        if (!current || current.id !== id) {
          return current;
        }

        return result.enquiry;
      });
    } else {
      setError(result.message);
    }

    setUpdatingId(null);
  }

  async function handleDeleteEnquiry(enquiry) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry from ${enquiry.name}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(enquiry.id);
    setError("");

    const result = await deleteEnquiry(enquiry.id);

    if (result.unauthorized) {
      handleUnauthorized();
      return;
    }

    if (result.success) {
      // Remove it immediately from the visible list.
      setEnquiries((current) =>
        current.filter((item) => item.id !== enquiry.id)
      );

      // If this enquiry was open in the View modal, close it.
      setSelected((current) =>
        current?.id === enquiry.id ? null : current
      );

      // Refresh Early Bird count in case a confirmed Early Bird
      // enquiry was deleted.
      await refreshEarlyBird();
    } else {
      setError(result.message);
    }

    setDeletingId(null);
  }

  function handleToggleNotifications() {
    setShowNotifications((prev) => !prev);
  }

  async function handleMarkRead(id) {
    const result = await markNotificationRead(id);

    if (result?.unauthorized) {
      handleUnauthorized();
      return;
    }

    await loadNotifications();
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-brand-navy">
              Admin · Enquiries
            </h1>

            <p className="text-sm text-slate-500">
              Free Fly &amp; Tourism
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="relative text-sm font-semibold text-brand-navy border border-slate-200 hover:border-slate-300 rounded-lg px-3.5 py-2 transition-colors"
              >
                Notifications

                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationsPanel
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                />
              )}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={loadEnquiries}
              className="text-sm font-semibold text-brand-blue hover:text-brand-sky border border-brand-blue/30 hover:border-brand-sky/50 rounded-lg px-3.5 py-2 transition-colors"
            >
              Refresh
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3.5 py-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Early Bird Summary + Countdown */}
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-start">
          <EarlyBirdSummary earlyBird={earlyBird} />

          {earlyBird && (
            <div className="w-full md:w-64">
              <Countdown endTime={earlyBird.offer_ends_at} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg py-3 px-4">
            {error}
          </p>
        )}

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <p className="text-center text-slate-500 py-12">
              Loading enquiries...
            </p>
          ) : enquiries.length === 0 ? (
            <p className="text-center text-slate-500 py-12">
              No enquiries yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <Th>Customer Name</Th>
                    <Th>Phone / WhatsApp</Th>
                    <Th>Destination</Th>
                    <Th>Travel Date</Th>
                    <Th>Travellers</Th>
                    <Th>Offer Type</Th>
                    <Th>Price</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {enquiries.map((enquiry) => (
                    <EnquiryRow
                      key={enquiry.id}
                      enquiry={enquiry}
                      isUpdating={updatingId === enquiry.id}
                      isDeleting={deletingId === enquiry.id}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteEnquiry}
                      onViewDetails={() => setSelected(enquiry)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selected && (
        <DetailsModal
          enquiry={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}


/* -------------------------------------------------------
   Early Bird Summary
------------------------------------------------------- */

function EarlyBirdSummary({ earlyBird }) {
  if (!earlyBird) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <SummaryCard
        label="Early Bird Total"
        value={earlyBird.total}
      />

      <SummaryCard
        label="Early Bird Booked"
        value={earlyBird.booked}
      />

      <SummaryCard
        label={
          earlyBird.sold_out
            ? "Early Bird Sold Out"
            : "Early Bird Remaining"
        }
        value={earlyBird.remaining}
        accent
      />
    </div>
  );
}


/* -------------------------------------------------------
   Notifications
------------------------------------------------------- */

function NotificationsPanel({
  notifications,
  onMarkRead,
}) {
  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 z-40">
      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No notifications yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`px-4 py-3 text-sm ${
                n.read
                  ? "bg-white"
                  : "bg-blue-50/60"
              }`}
            >
              <p className="font-medium text-brand-navy">
                {n.message}
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Destination: {n.destination}
              </p>

              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-slate-400">
                  {new Date(n.created_at).toLocaleString("en-IN")}
                </p>

                {!n.read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(n.id)}
                    className="text-xs font-semibold text-brand-blue hover:text-brand-sky"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


/* -------------------------------------------------------
   Summary Card
------------------------------------------------------- */

function SummaryCard({
  label,
  value,
  accent,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 sm:px-6 py-4 text-center">
      <p
        className={`font-display font-extrabold text-2xl sm:text-3xl ${
          accent
            ? "text-brand-blue"
            : "text-brand-navy"
        }`}
      >
        {value}
      </p>

      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        {label}
      </p>
    </div>
  );
}


/* -------------------------------------------------------
   Table Header
------------------------------------------------------- */

function Th({ children }) {
  return (
    <th className="px-4 py-3 font-semibold whitespace-nowrap">
      {children}
    </th>
  );
}


/* -------------------------------------------------------
   Enquiry Row
------------------------------------------------------- */

function EnquiryRow({
  enquiry,
  isUpdating,
  isDeleting,
  onStatusChange,
  onDelete,
  onViewDetails,
}) {
  return (
    <tr className="align-middle">
      {/* Name */}
      <td className="px-4 py-3 font-medium text-brand-navy whitespace-nowrap">
        {enquiry.name}
      </td>

      {/* Phone */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
        {enquiry.phone}
      </td>

      {/* Destination */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
        {enquiry.destination}
      </td>

      {/* Travel Date */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
        {formatDateRange(
          enquiry.travel_date_from,
          enquiry.travel_date_to
        )}
      </td>

      {/* Travellers */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-center">
        {enquiry.travellers}
      </td>

      {/* Offer */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
        {enquiry.offer_type || "—"}
      </td>

      {/* Price */}
      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
        {formatPrice(enquiry.price)}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <select
          value={enquiry.status}
          disabled={isUpdating || isDeleting}
          onChange={(e) =>
            onStatusChange(
              enquiry.id,
              e.target.value
            )
          }
          className={`text-xs font-semibold rounded-full border px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 disabled:opacity-60 ${
            STATUS_STYLES[enquiry.status] ||
            "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {/* View */}
          <button
            type="button"
            onClick={onViewDetails}
            disabled={isDeleting}
            title="View Details"
            className="text-xs font-semibold text-brand-blue hover:text-brand-sky border border-brand-blue/30 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
          >
            View
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(enquiry)}
            disabled={isDeleting || isUpdating}
            title="Delete Enquiry"
            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}


/* -------------------------------------------------------
   Details Modal
------------------------------------------------------- */

function DetailsModal({
  enquiry,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-brand-navy">
            Enquiry Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <dl className="space-y-2.5 text-sm">
          <Detail
            label="Name"
            value={enquiry.name}
          />

          <Detail
            label="Phone / WhatsApp"
            value={enquiry.phone}
          />

          <Detail
            label="Email"
            value={enquiry.email || "—"}
          />

          <Detail
            label="Destination"
            value={enquiry.destination}
          />

          <Detail
            label="Travel Date"
            value={formatDateRange(
              enquiry.travel_date_from,
              enquiry.travel_date_to
            )}
          />

          <Detail
            label="Travellers"
            value={enquiry.travellers}
          />

          <Detail
            label="Trip Type"
            value={enquiry.trip_type}
          />

          <Detail
            label="Offer Type"
            value={
              enquiry.offer_type ||
              "Not yet assigned"
            }
          />

          <Detail
            label="Price"
            value={formatPrice(enquiry.price)}
          />

          <Detail
            label="Status"
            value={enquiry.status}
          />

          <Detail
            label="Message"
            value={enquiry.message || "—"}
          />

          <Detail
            label="Submitted"
            value={new Date(
              enquiry.created_at
            ).toLocaleString("en-IN")}
          />
        </dl>
      </div>
    </div>
  );
}


/* -------------------------------------------------------
   Detail
------------------------------------------------------- */

function Detail({
  label,
  value,
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">
        {label}
      </dt>

      <dd className="text-right font-medium text-slate-700">
        {value}
      </dd>
    </div>
  );
}