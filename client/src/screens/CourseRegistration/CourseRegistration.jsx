import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import Button from "../../components/Button/Button";
import ModalCourseRegistration from "./ModalCourseRegistration";

export function CourseRegistration() {
  const [openModal, setOpenModal] = useState(false);

  const methods = useForm({});
  const { handleSubmit, getValues } = methods;

  const handleOpenModal = useCallback(() => setOpenModal(true));

  const dispatch = useDispatch();
  const submit = useCallback(() => dispatch({ values: getValues() }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>
        <Button onClick={handleOpenModal}>CADASTRAR</Button>

        <ModalCourseRegistration
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      </form>
    </FormProvider>
  );
}
