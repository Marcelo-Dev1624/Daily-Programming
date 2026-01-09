"use client";

import { useCallback, useEffect, useState } from "react";

type Shipment = {
  id: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  note: string | null;
  createdAt: string;
};

type Carrier = (typeof carriers)[number];
type Status = (typeof statuses)[number];

type FormState = {
  carrier: Carrier;
  trackingNumber: string;
  status: Status;
  note: string;
};

const carriers = ["DHL", "FedEx", "UPS", "Correos"] as const;
const statuses = ["CREATED", "IN_TRANSIT", "DELIVERED", "ISSUE"] as const;

export default function Home() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    carrier: carriers[0],
    trackingNumber: "",
    status: "CREATED",
    note: "",
  });

  const filterOptions = ["ALL", ...statuses];

  const loadShipments = useCallback(async (activeFilter: string) => {
    setIsLoading(true);
    setError("");
    try {
      const query = activeFilter !== "ALL" ? `?status=${activeFilter}` : "";
      const response = await fetch(`/api/shipments${query}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to load shipments.");
      }
      setShipments(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load shipments.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadShipments(filter);
  }, [filter, loadShipments]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrier: formData.carrier,
          trackingNumber: formData.trackingNumber,
          status: formData.status,
          note: formData.note || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create shipment.");
      }
      setFormData({
        carrier: carriers[0],
        trackingNumber: "",
        status: "CREATED",
        note: "",
      });
      await loadShipments(filter);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create shipment.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setError("");
    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update shipment.");
      }
      await loadShipments(filter);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update shipment.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fde68a,_#fef3c7_45%,_#fff8ec_70%)] px-6 py-12 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Day 1
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Daily Shipping Tracker
          </h1>
          <p className="max-w-2xl text-base text-zinc-600 sm:text-lg">
            Register shipments, filter by status, and update progress from a
            single table.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.2fr)]">
          <div className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(120,53,15,0.4)] backdrop-blur">
            <h2 className="text-lg font-semibold text-zinc-900">
              New shipment
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Add a tracking number and start tracking instantly.
            </p>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Carrier
                <select
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  value={formData.carrier}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      carrier: event.target.value as Carrier,
                    }))
                  }
                >
                  {carriers.map((carrier) => (
                    <option key={carrier} value={carrier}>
                      {carrier}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Tracking number
                <input
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="DHL12345"
                  value={formData.trackingNumber}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      trackingNumber: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Status
                <select
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      carrier: event.target.value as Carrier,
                    }))
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Note (optional)
                <input
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Fragile or address update"
                  value={formData.note}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      note: event.target.value,
                    }))
                  }
                />
              </label>

              <button
                className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-amber-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(120,53,15,0.4)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Active shipments
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {isLoading ? "Updating..." : `${shipments.length} results`}
                </p>
              </div>
              <label className="text-sm font-medium text-zinc-600">
                Filter by status
                <select
                  className="mt-2 h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 overflow-auto rounded-2xl border border-amber-100 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-amber-50 text-xs uppercase tracking-[0.2em] text-amber-700">
                  <tr>
                    <th className="px-4 py-3">Carrier</th>
                    <th className="px-4 py-3">Tracking</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="border-t border-amber-100 text-zinc-700"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        {shipment.carrier}
                      </td>
                      <td className="px-4 py-3">{shipment.trackingNumber}</td>
                      <td className="px-4 py-3">
                        <select
                          className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-900 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          value={shipment.status}
                          onChange={(event) =>
                            handleStatusChange(shipment.id, event.target.value)
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">{shipment.note || "—"}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(shipment.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {!shipments.length ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-zinc-500"
                      >
                        No shipments yet. Add one to get started.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
