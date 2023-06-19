import { AuthUserType } from "../../core/contexts/Auth";
import { AccomodationMultiStepForm } from "../../features/accommodations/creation/AccommodationMultiStepForm";

const NewAccommodation = () => {
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <AccomodationMultiStepForm />
      </div>
    </>
  );
};

NewAccommodation.requireAuth = true;
NewAccommodation.allowedRoles = [AuthUserType.Host];

export default NewAccommodation;
