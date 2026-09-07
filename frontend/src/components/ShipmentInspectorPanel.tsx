"use client";

import { useEffect, useState } from "react";
import { nexaClient } from "@/lib/nexafreight/client";
import type { ShipmentDetail } from "@/lib/nexafreight/types";

interface ShipmentInspectorPanelProps {
  shipmentId: string | null;
  onClose: () => void;
}

export default function ShipmentInspectorPanel({
  shipmentId,
  onClose,
}: ShipmentInspectorPanelProps) {
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentId) {
      setShipment(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    nexaClient
      .getShipmentDetail(shipmentId)
      .then((data) => {
        if (!cancelled) setShipment(data as ShipmentDetail);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load shipment");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shipmentId]);

  if (!shipmentId) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-neutral-900 text-white shadow-xl z-50 overflow-y-auto p-4 border-l border-neutral-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shipment Detail</h2>
        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
          ✕
        </button>
      </div>

      {loading && <p className="text-neutral-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {shipment && (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-neutral-400">Reference</p>
            <p className="font-mono">{shipment.reference ?? `NF-${String(shipment.id).slice(0, 8).toUpperCase()}`}</p>
          </div>

          <div>
            <p className="text-xs text-neutral-400">Route</p>
            <p>{shipment.origin} → {shipment.dest ?? shipment.destination}</p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-xs text-neutral-400">Mode</p>
              <p>{shipment.mode}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Status</p>
              <p>{shipment.status}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-neutral-400">SLA Deadline</p>
            <p>{shipment.strictest_sla_deadline ? new Date(shipment.strictest_sla_deadline).toLocaleString() : "None"}</p>
          </div>

          {shipment.revised_eta && (
            <div>
              <p className="text-xs text-neutral-400">Revised ETA</p>
              <p>{new Date(shipment.revised_eta).toLocaleString()}</p>
            </div>
          )}

          {/* Risk badge + ETA range bar slot in here once T-040 lands */}

          <div>
            <p className="text-xs text-neutral-400 mb-1">Legs</p>
            <ul className="space-y-1">
              {shipment.legs?.map((leg) => (
                <li key={leg.id} className="text-sm border-l-2 border-neutral-700 pl-2">
                  {leg.leg_type ?? `Leg #${leg.sequence_number ?? leg.sequence ?? 1}`} ({leg.mode}) — {leg.route_quality ?? "STANDARD"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-neutral-400 mb-1">Recent Events</p>
            <ul className="space-y-1">
              {(!shipment.events || shipment.events.length === 0) ? (
                <li className="text-xs text-neutral-500 italic">No events recorded</li>
              ) : (
                shipment.events.slice(0, 5).map((ev, idx) => (
                  <li key={ev.id ?? idx} className="text-sm text-neutral-300">
                    {ev.type ?? ev.event_type} — {ev.message ?? ev.description}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
