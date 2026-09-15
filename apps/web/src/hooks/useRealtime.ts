"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";

const REALTIME_EVENTS = ["table:created", "table:updated", "order:created", "order:updated"];

export function useRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    for (const event of REALTIME_EVENTS) {
      socket.on(event, handleUpdate);
    }

    return () => {
      for (const event of REALTIME_EVENTS) {
        socket.off(event, handleUpdate);
      }
    };
  }, [queryClient]);
}
