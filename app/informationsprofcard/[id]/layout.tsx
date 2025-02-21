import { ReactNode } from "react";

export default function MinimalLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}