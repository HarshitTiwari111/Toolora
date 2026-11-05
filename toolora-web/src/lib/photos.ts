// Unsplash photos (Unsplash License: free to use, credit appreciated).
// Har category ki apni photo, taaki jis article ki khud ki cover image nahi hai uska card bhi alag dikhe.
// Nayi photo: unsplash.com par "Free" filter ke saath chuno (Unsplash+ nahi), id + photographer yahan likho.
export type Photo = { id: string; alt: string; author: string; username: string };

export const categoryPhotos: Record<string, Photo> = {
  // AI
  writing: { id: "photo-1486312338219-ce68d2c6f44d", alt: "Person typing on a laptop at a desk", author: "Glenn Carstens-Peters", username: "glenncarstenspeters" },
  coding: { id: "photo-1515879218367-8466d910aaa4", alt: "Computer screen showing lines of code", author: "Chris Ried", username: "cdr6934" },
  "image-generation": { id: "photo-1636690513351-0af1763f6237", alt: "Colourful abstract digital artwork with wavy lines", author: "vackground.com", username: "vackground" },
  video: { id: "photo-1574717024653-61fd2cf4d44d", alt: "Video editing timeline with clips on a dark screen", author: "Peter Stumpf", username: "peter_s" },
  audio: { id: "photo-1511671782779-c97d3d27a1d4", alt: "Studio condenser microphone with soft background lights", author: "israel palacio", username: "othentikisra" },
  research: { id: "photo-1524995997946-a1c2e315a42f", alt: "Books on wooden library shelves", author: "Susan Q Yin", username: "syinq" },
  productivity: { id: "photo-1499750310107-5fef28a66643", alt: "Laptop, coffee mug and phone on a tidy desk", author: "Andrew Neel", username: "andrewtneel" },
  marketing: { id: "photo-1522071820081-009f0129c71c", alt: "Team working together around laptops", author: "Annie Spratt", username: "anniespratt" },
  chatbots: { id: "photo-1662974770404-468fd9660389", alt: "Chat speech bubbles on a translucent screen", author: "kuu akura", username: "akurakuu" },
  automation: { id: "photo-1647427060118-4911c9821b82", alt: "Automated factory with robotic machines", author: "Simon Kadula", username: "simonkadula" },
  // SaaS
  "project-management": { id: "photo-1503551723145-6c040742065b-v2", alt: "Colourful sticky notes pinned to a planning board", author: "Patrick Perkins", username: "patrickperkins" },
  crm: { id: "photo-1758519288905-38b7b00c1023", alt: "Two business people shaking hands across a table", author: "Vitaly Gariev", username: "silverkblack" },
  "email-marketing": { id: "photo-1508780709619-79562169bc64", alt: "Person working on a laptop at a wooden table", author: "Kaitlyn Baker", username: "kaitlynbaker" },
  analytics: { id: "photo-1551288049-bebda4e38f71", alt: "Analytics charts on a laptop screen", author: "Luke Chesser", username: "lukechesser" },
  "customer-support": { id: "photo-1553775282-20af80779df7", alt: "Headset next to a laptop on a desk", author: "Petr Macháček", username: "machec" },
  finance: { id: "photo-1626266061368-46a8f578ddd6", alt: "Person using a calculator at a desk", author: "Towfiqu barbhuiya", username: "towfiqu999999" },
  security: { id: "photo-1550751827-4bd374c3f58b", alt: "Glowing teal circuit-style light panel", author: "Adi Goldstein", username: "adigold1" },
  design: { id: "photo-1716471330463-f475b00f0506", alt: "Designer desk with keyboard, pencils and colour swatches", author: "Andy Brown", username: "basallt" },
};

const UTM = "utm_source=toolora&utm_medium=referral";

export function photoUrl(p: Photo, w: number, h: number) {
  return `https://images.unsplash.com/${p.id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;
}

export function photoSrcSet(p: Photo, ratio = 9 / 16) {
  return [480, 800, 1200, 1600].map((w) => `${photoUrl(p, w, Math.round(w * ratio))} ${w}w`).join(", ");
}

export function photoCredit(p: Photo) {
  return {
    author: p.author,
    authorUrl: `https://unsplash.com/@${p.username}?${UTM}`,
    unsplashUrl: `https://unsplash.com/?${UTM}`,
  };
}

export function categoryPhoto(slug?: string | null) {
  return slug ? categoryPhotos[slug] : undefined;
}
