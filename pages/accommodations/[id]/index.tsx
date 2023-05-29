import { useRouter } from "next/router";
import { AccommodationPage } from "../../../features/accommodations/preview/AccommodationPage";

const Accommodation = () => {
  const router = useRouter();
  const { id } = router.query;
  return id && <AccommodationPage id={id + ""} />;
};

export default Accommodation;
