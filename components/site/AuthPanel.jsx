"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { CountrySelect, FlagImage } from "@/components/ui/country-select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { dialPrefix } from "@/lib/countries";
import { cn } from "@/lib/utils";

const MODE_CONTENT = {
  signup: {
    title: "Create your account",
    copy: "Start your ByteFX account with a few clear, secure steps.",
    topPrompt: "Already registered?",
    topLabel: "Login",
    topHref: "/login",
  },
  login: {
    title: "Login",
    copy: "Access your trading account securely.",
    topPrompt: "New to ByteFX?",
    topLabel: "Create account",
    topHref: "/signup",
  },
  forgot: {
    title: "Forgot password",
    copy: "Enter your registered email and we’ll help you reset your password.",
    topPrompt: "Remembered it?",
    topLabel: "Login",
    topHref: "/login",
  },
  verify: {
    title: "Verify your email",
    copy: "Enter the six-digit code sent to your email address.",
    topPrompt: "Wrong account?",
    topLabel: "Back to login",
    topHref: "/login",
  },
};

const inputClassName =
  "h-12 w-full rounded-xl border border-[#ccd2da]/90 bg-white/68 pl-11 pr-4 text-[14px] text-[#101a2e] shadow-[inset_0_1px_0_rgba(255,255,255,.78)] outline-none transition-all duration-300 ease-out placeholder:text-[#8794ad] hover:border-[#aeb8c7] hover:bg-white/82 focus:-translate-y-px focus:border-[#2b68d0] focus:bg-white/94 focus:ring-4 focus:ring-[#1356be]/10 motion-reduce:transform-none dark:border-white/13 dark:bg-white/[0.055] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,.045)] dark:placeholder:text-white/38 dark:hover:border-white/24 dark:hover:bg-white/[0.075] dark:focus:border-[#70a6ff] dark:focus:bg-white/[0.09]";

function AuthHeader({ mode, reduceMotion }) {
  const content = MODE_CONTENT[mode];

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-20 bg-transparent"
    >
      <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href="/"
          className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/75 bg-white/52 px-4 text-[13px] font-semibold text-[#45536b] shadow-[0_10px_28px_-20px_rgba(31,42,60,.8)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white hover:bg-white/82 hover:text-[#1356be] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1356be]/35 motion-reduce:transform-none dark:border-white/12 dark:bg-white/[0.055] dark:text-white/68 dark:hover:border-white/24 dark:hover:bg-white/[0.1] dark:hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none"
            strokeWidth={2.1}
          />
          Back to website
        </Link>

        <div className="flex items-center gap-2 text-[13px] sm:gap-3 sm:text-[14px]">
          <span className="hidden text-[#71809a] sm:inline dark:text-white/45">
            {content.topPrompt}
          </span>
          <Link
            href={content.topHref}
            className="rounded-full px-3 py-2 font-semibold text-[#0d5ee8] transition-all duration-300 hover:bg-white/55 hover:text-[#084bbd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1356be]/30 dark:text-[#8ab8ff] dark:hover:bg-white/[0.07] dark:hover:text-white"
          >
            {content.topLabel}
          </Link>

          {/* The auth routes render without the site chrome (see SiteShell),
              so the navbar's theme switch is not on the page — this is the
              only way in or out of dark mode while signing up. */}
          <ThemeToggle className="h-10 w-10 border-white/75 bg-white/52 text-[#45536b] shadow-[0_10px_28px_-20px_rgba(31,42,60,.8)] backdrop-blur-xl hover:border-white hover:bg-white/82 hover:text-[#1356be] dark:border-white/12 dark:bg-white/[0.055] dark:text-white/68 dark:hover:border-white/24 dark:hover:bg-white/[0.1] dark:hover:text-white" />
        </div>
      </div>
    </motion.header>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  className,
  inputClassName: inputClass,
  ...props
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12.5px] font-medium text-[#182238] dark:text-white/78"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#7183a3] dark:text-white/42"
          strokeWidth={1.9}
        />
        <input
          id={id}
          name={id}
          className={cn(inputClassName, inputClass)}
          {...props}
        />
      </div>
    </div>
  );
}

function PasswordField({ id, label, onChange, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12.5px] font-medium text-[#182238] dark:text-white/78"
      >
        {label}
      </label>
      <div className="relative">
        <LockKeyhole
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#7183a3] dark:text-white/42"
          strokeWidth={1.9}
        />
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          onChange={onChange}
          className={cn(inputClassName, "pr-11")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#7183a3] transition-all duration-300 hover:scale-105 hover:bg-[#eef3fa] hover:text-[#1356be] active:scale-95 motion-reduce:transform-none dark:text-white/42 dark:hover:bg-white/8 dark:hover:text-white"
        >
          {visible ? (
            <EyeOff className="h-[17px] w-[17px]" strokeWidth={1.9} />
          ) : (
            <Eye className="h-[17px] w-[17px]" strokeWidth={1.9} />
          )}
        </button>
      </div>
    </div>
  );
}

function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="group flex h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-[#43d300] px-5 text-[15px] font-semibold text-[#071500] shadow-[0_13px_28px_-14px_rgba(67,211,0,.75)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#4ce000] hover:shadow-[0_17px_34px_-14px_rgba(67,211,0,.82)] active:translate-y-0 active:scale-[.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2fb500] focus-visible:ring-offset-2 motion-reduce:transform-none"
    >
      {children}
      <ArrowRight
        className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
        strokeWidth={2.2}
      />
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-[19px] w-[19px] shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.253-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.908c1.703-1.567 2.685-3.874 2.685-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.329-1.585-5.037-3.711H.956v2.333C2.437 15.983 5.482 18 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.963 10.71A5.42 5.42 0 0 1 3.682 9c0-.595.101-1.17.281-1.71V4.957H.956A9 9 0 0 0 0 9c0 1.451.347 2.827.956 4.043l3.007-2.333Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.579c1.321 0 2.508.455 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0 5.482 0 2.437 2.017.956 4.957L3.963 7.29C4.671 5.164 6.656 3.579 9 3.579Z"
      />
    </svg>
  );
}

function GoogleButton({ mode }) {
  return (
    <button
      type="button"
      className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#cbd1da] bg-white/76 text-[14px] font-semibold text-[#172238] shadow-[0_12px_30px_-23px_rgba(4,18,43,.75)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#aeb8c7] hover:bg-white hover:shadow-[0_16px_36px_-23px_rgba(4,18,43,.85)] active:translate-y-0 active:scale-[.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285f4]/35 motion-reduce:transform-none dark:border-white/15 dark:bg-white/[0.075] dark:text-white dark:hover:border-white/28 dark:hover:bg-white/[0.12]"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-[0_5px_14px_-9px_rgba(0,0,0,.85)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
        <GoogleIcon />
      </span>
      {mode === "signup" ? "Sign up with Google" : "Continue with Google"}
    </button>
  );
}

function Divider({ mode }) {
  return (
    <div className="my-5 flex items-center gap-4">
      <span aria-hidden="true" className="h-px flex-1 bg-[#cdd3dc]/80 dark:bg-white/10" />
      <span className="text-[11.5px] font-medium text-[#748096] dark:text-white/40">
        {mode === "signup" ? "or sign up with email" : "or continue with email"}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-[#cdd3dc]/80 dark:bg-white/10" />
    </div>
  );
}

function SecurityNote() {
  return (
    <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11.5px] leading-relaxed text-[#7786a1] dark:text-white/42">
      <ShieldCheck className="h-4 w-4 shrink-0 text-[#4a78bd]" strokeWidth={2} />
      Only enter account details on the official ByteFX domain.
    </p>
  );
}

/**
 * Country and phone are one control in two halves: picking a country writes
 * that country's dialling code into the phone field and swaps the icon slot
 * for its flag, so the number is already in international form before anyone
 * types a digit. Switching country later replaces the old code rather than
 * stacking a second one in front of it.
 */
function CountryAndPhone({ country, onCountryChange, phone, setPhone, phoneRef }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="country"
          className="mb-1.5 block text-[12.5px] font-medium text-[#182238] dark:text-white/78"
        >
          Country
        </label>
        <CountrySelect
          id="country"
          name="country"
          value={country}
          onChange={onCountryChange}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-[12.5px] font-medium text-[#182238] dark:text-white/78"
        >
          Phone number
        </label>
        <div className="relative">
          {country ? (
            <FlagImage
              country={country}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
            />
          ) : (
            <Phone
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-[17px] w-[17px] -translate-y-1/2 text-[#7183a3] dark:text-white/42"
              strokeWidth={1.9}
            />
          )}
          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={country ? `${country.dial} 00 000 0000` : "Select a country first"}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
}

function SignupForm({
  password,
  setPassword,
  setConfirmPassword,
  country,
  onCountryChange,
  phone,
  setPhone,
  phoneRef,
}) {
  const requirements = useMemo(
    () => [
      { label: "8+ characters", met: password.length >= 8 },
      { label: "One uppercase", met: /[A-Z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      { label: "One symbol", met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="first-name" label="First name" icon={UserRound} placeholder="Enter first name" autoComplete="given-name" required />
        <Field id="last-name" label="Last name" icon={UserRound} placeholder="Enter last name" autoComplete="family-name" required />
      </div>
      <Field id="email" label="Email address" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" required />

      <CountryAndPhone
        country={country}
        onCountryChange={onCountryChange}
        phone={phone}
        setPhone={setPhone}
        phoneRef={phoneRef}
      />

      <PasswordField id="password" label="Password" placeholder="Create a strong password" autoComplete="new-password" minLength={8} required onChange={(event) => setPassword(event.target.value)} />
      <PasswordField id="confirm-password" label="Confirm password" placeholder="Re-enter your password" autoComplete="new-password" minLength={8} required onChange={(event) => setConfirmPassword(event.target.value)} />

      <div>
        <p className="mb-2 text-[11.5px] font-medium text-[#65738d] dark:text-white/52">Password must include:</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
          {requirements.map((item) => (
            <span key={item.label} className={cn("flex items-center gap-1.5 text-[10.5px] transition-colors", item.met ? "text-[#249b00] dark:text-[#85e761]" : "text-[#7b8aa4] dark:text-white/38")}>
              <span className={cn("flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border", item.met ? "border-[#3dc512] bg-[#effce9]" : "border-current")}>
                {item.met ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-[12px] leading-relaxed text-[#52617c] dark:text-white/58">
        <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 rounded border-[#bcc8da] accent-[#38c800]" />
        <span>
          I agree to the <Link href="/legal/terms" className="font-medium text-[#0d5ee8] hover:underline">Terms of Service</Link> and <Link href="/legal/privacy" className="font-medium text-[#0d5ee8] hover:underline">Privacy Policy</Link>.
        </span>
      </label>
    </>
  );
}

function LoginForm() {
  return (
    <>
      <Field id="email" label="Email address" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" required />
      <div>
        <PasswordField id="password" label="Password" placeholder="Enter your password" autoComplete="current-password" required />
        <div className="mt-3 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-[12px] text-[#65738d] dark:text-white/48">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-[#bcc8da] accent-[#38c800]" />
            Keep me signed in
          </label>
          <Link href="/forgot-password" className="text-[12px] font-semibold text-[#0d5ee8] hover:underline dark:text-[#7eb0ff]">Forgot password?</Link>
        </div>
      </div>
    </>
  );
}

function ForgotForm() {
  return <Field id="email" label="Email address" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" required />;
}

function VerifyForm({ code, setCode, onResend }) {
  return (
    <>
      <div>
        <label htmlFor="verification-code" className="mb-1.5 block text-[12.5px] font-medium text-[#182238] dark:text-white/78">Verification code</label>
        <div className="relative">
          <KeyRound aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#7183a3] dark:text-white/42" strokeWidth={1.9} />
          <input
            id="verification-code"
            name="verification-code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            required
            className={cn(inputClassName, "h-14 pl-12 text-center text-[21px] font-semibold tracking-[0.42em] tabular-nums")}
          />
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#74839d] dark:text-white/42">The code expires shortly. Check your spam folder if it does not arrive.</p>
      </div>
      <button type="button" onClick={onResend} className="inline-flex items-center justify-center gap-2 text-[12.5px] font-semibold text-[#0d5ee8] hover:underline dark:text-[#7eb0ff]">
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
        Resend code
      </button>
    </>
  );
}

export function AuthPanel({ mode = "signup" }) {
  const safeMode = MODE_CONTENT[mode] ? mode : "signup";
  const content = MODE_CONTENT[safeMode];
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState("");
  const phoneRef = useRef(null);
  const isSignup = safeMode === "signup";
  const hasGoogleAuth = safeMode === "signup" || safeMode === "login";

  const handleCountryChange = (next) => {
    setPhone((current) => {
      const previous = dialPrefix(country);
      const national = previous && current.startsWith(previous)
        ? current.slice(previous.length)
        // Someone may have typed a code of their own before picking a
        // country. Only drop it when a separator makes it unambiguous.
        : current.replace(/^\+\d{1,4}[\s-]+/, "");
      return dialPrefix(next) + national;
    });
    setCountry(next);

    // Land the caret after the code so the next keystroke is the number.
    requestAnimationFrame(() => {
      const input = phoneRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("");

    if (safeMode === "signup") {
      if (!country) {
        setStatus("Choose your country so we can dial your number correctly.");
        return;
      }
      if (password !== confirmPassword) {
        setStatus("Passwords do not match. Please check both fields.");
        return;
      }
      router.push("/verify-email");
      return;
    }
    if (safeMode === "forgot") {
      router.push("/verify-email");
      return;
    }
    if (safeMode === "verify") {
      if (code.length !== 6) {
        setStatus("Enter the complete six-digit verification code.");
        return;
      }
      router.push("/login");
      return;
    }
    setStatus("Secure login is ready to connect to the account service.");
  };

  return (
    <section className="auth-page relative min-h-svh overflow-hidden bg-[#eef1f5] text-[#101a2e] transition-colors duration-500 dark:bg-[#080b10] dark:text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[-31rem] h-[58rem] w-[76rem] -translate-x-1/2 rounded-full bg-white/95 blur-3xl dark:bg-[#202731]/75" />
        <div className="absolute -left-48 bottom-[-28rem] h-[50rem] w-[54rem] rounded-full bg-[#cfd5dd]/85 blur-3xl dark:bg-[#16202c]/60" />
        <div className="absolute -right-48 bottom-[-30rem] h-[54rem] w-[58rem] rounded-full bg-[#f6f7f8] blur-3xl dark:bg-[#252a28]/45" />
        <div className="auth-grid absolute inset-0 opacity-[0.2] dark:opacity-[0.1]" />
      </div>

      <AuthHeader mode={safeMode} reduceMotion={reduceMotion} />

      <main className="relative z-10 flex min-h-[calc(100svh-76px)] items-center justify-center px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.988 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.58,
            delay: reduceMotion ? 0 : 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn(
            "auth-platinum-card w-full rounded-[26px] p-6 sm:p-9",
            isSignup ? "max-w-[640px]" : "max-w-[510px]"
          )}
        >
          <Image src="/assets/Logo.webp" alt="ByteFX" width={384} height={82} className="h-[25px] w-auto" />

          <div className="mt-7">
            <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.035em] text-[#101a2e] sm:text-[34px] dark:text-white">{content.title}</h1>
            <p className="mt-2 max-w-[45ch] text-[13.5px] leading-relaxed text-[#65738d] dark:text-white/52">{content.copy}</p>
          </div>

          {hasGoogleAuth ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.42,
                delay: reduceMotion ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7"
            >
              <GoogleButton mode={safeMode} />
              <Divider mode={safeMode} />
            </motion.div>
          ) : null}

          <form onSubmit={handleSubmit} className={cn("space-y-4", !hasGoogleAuth && "mt-7")}>
            {safeMode === "signup" ? (
              <SignupForm
                password={password}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                country={country}
                onCountryChange={handleCountryChange}
                phone={phone}
                setPhone={setPhone}
                phoneRef={phoneRef}
              />
            ) : null}
            {safeMode === "login" ? <LoginForm /> : null}
            {safeMode === "forgot" ? <ForgotForm /> : null}
            {safeMode === "verify" ? <VerifyForm code={code} setCode={setCode} onResend={() => setStatus("A new verification code has been requested.")} /> : null}

            <AnimatePresence initial={false}>
              {status ? (
                <motion.p
                  key={status}
                  initial={reduceMotion ? false : { height: 0, opacity: 0, y: -5 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, y: -5 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                  role="status"
                  aria-live="polite"
                  className="overflow-hidden rounded-xl border border-[#cbd4df] bg-white/48 px-3.5 py-3 text-[11.5px] leading-relaxed text-[#52617c] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/58"
                >
                  {status}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="pt-1">
              <SubmitButton>
                {safeMode === "signup" ? "Create account" : safeMode === "login" ? "Login" : safeMode === "forgot" ? "Send reset instructions" : "Verify email"}
              </SubmitButton>
            </div>
          </form>

          {safeMode === "forgot" ? (
            <Link href="/login" className="group mt-6 flex items-center justify-center gap-2 rounded-lg py-1 text-[12.5px] font-semibold text-[#0d5ee8] transition-colors duration-300 hover:text-[#084bbd] dark:text-[#7eb0ff] dark:hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none" />
              Return to login
            </Link>
          ) : null}

          <SecurityNote />
        </motion.div>
      </main>
    </section>
  );
}
