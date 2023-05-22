import { useRouter } from "next/router";
import { AccommodationEditPage } from "../../../features/accommodations/edit/AccommodationEditPage";

const Accommodation = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div className="">{id && <AccommodationEditPage id={id + ""} />}</div>;
};

export default Accommodation;
