"use client";

import { useEffect, useMemo, useState } from "react";

const COOLDOWN_SECONDS_DEFAULT = 60;

export function useResendCooldown(
  cooldownSeconds: number = COOLDOWN_SECONDS_DEFAULT,
) {
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    if (cooldownUntilMs === null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldownUntilMs]);

  const secondsLeft = useMemo(() => {
    if (cooldownUntilMs === null) {
      return 0;
    }

    const remainingMs = cooldownUntilMs - nowMs;

    if (remainingMs <= 0) {
      return 0;
    }

    return Math.ceil(remainingMs / 1000);
  }, [cooldownUntilMs, nowMs]);

  useEffect(() => {
    if (secondsLeft > 0 || cooldownUntilMs === null) {
      return;
    }

    setCooldownUntilMs(null);
  }, [secondsLeft, cooldownUntilMs]);

  const startCooldown = () => {
    setNowMs(Date.now());
    setCooldownUntilMs(Date.now() + cooldownSeconds * 1000);
  };

  return {
    secondsLeft,
    isCooldownActive: secondsLeft > 0,
    startCooldown,
  };
}
