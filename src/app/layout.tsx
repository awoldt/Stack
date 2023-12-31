import { Inter } from "next/font/google";
import "./global.css";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";
import { IsValidAccountCookie } from "@/functions";
import CustomNav from "../components/CustomNav";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const account = await IsValidAccountCookie(cookieStore.get("a_id"));

  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/5f2bb09986.js"
          crossOrigin="anonymous"
          async
        ></script>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body className={inter.className}>
        <section>
          <CustomNav isSignedIn={account === false ? false : true} />
        </section>
        {children}
        <Footer />
      </body>
    </html>
  );
}
