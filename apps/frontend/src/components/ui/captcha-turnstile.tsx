// components/TurnstileWidget.tsx
import { env } from "@/lib/utils";
import Script from "next/script";
import Turnstile from "react-turnstile";

type Props = {
  onVerify: (token: string) => void;
};

export default function TurnstileWidget({ onVerify }: Props) {
  return (
    <Turnstile
      sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onVerify={onVerify}
      theme="auto"
      size="flexible"
    />
  );
}

export const _TurnstileWidget = () => {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        defer
      ></Script>
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        data-theme="auto"
        data-size="flexible"
        data-callback="onSuccess"
      ></div>
    </>
  );
};
