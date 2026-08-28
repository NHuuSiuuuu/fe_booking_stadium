import type { Metadata } from "next";

export const SITE_URL = "https://booking-stadium.vercel.app";
export const SITE_NAME = "NHuu Booking Stadium";
export const DEFAULT_OG_IMAGE = "/banner.png";

export function absoluteUrl(pathname = "/") {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  return new URL(pathname, SITE_URL).toString();
}

export function publicPageMetadata({
  title,
  description,
  pathname,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  pathname: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const noIndexRobots = {
  index: false,
  follow: false,
};

