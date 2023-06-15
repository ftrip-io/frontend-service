import { HomePage } from "../features/home/HomePage";

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}

Home.requireAuth = false;
