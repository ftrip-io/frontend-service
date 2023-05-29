import { useRouter } from "next/router";
import { AccommodationEditPage } from "../../../features/accommodations/edit/AccommodationEditPage";

const Accommodation = () => {
  const router = useRouter();
  const { id } = router.query;
  return id && <AccommodationEditPage id={id + ""} />;
};

export default Accommodation;
