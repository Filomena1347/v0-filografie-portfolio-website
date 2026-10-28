import { CookieSettingsButton } from "@/components/cookie-settings-button"

export function LegalFooter({ cookieSettings = false }: { cookieSettings?: boolean }) {
  return (
    <footer className="border-t border-current/10 px-6 py-6 text-center text-xs leading-relaxed text-current/60 text-balance">
      Filoména Veronika Mrštná · IČO: 19282362 ·{" "}
      <a
        href="mailto:info@filography.cz"
        className="underline-offset-2 hover:underline focus-visible:underline"
      >
        info@filography.cz
      </a>
      {cookieSettings && (
        <>
          {" · "}
          <CookieSettingsButton />
        </>
      )}
    </footer>
  )
}
