import { useRouter } from "next/router";
import { AccommodationEditPage } from "../../../features/accommodations/edit/AccommodationEditPage";
import { AuthUserType } from "../../../core/contexts/Auth";

const Accommodation = () => {
  const router = useRouter();
  const { id } = router.query;
  return id && <AccommodationEditPage id={id + ""} />;
};

Accommodation.requireAuth = true;
Accommodation.allowedRoles = [AuthUserType.Host];

export default Accommodation;
