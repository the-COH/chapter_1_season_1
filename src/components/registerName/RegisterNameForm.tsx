import React, { FC, useEffect } from "react";
import { useFindNameOwner } from "../../hooks/useFindNameOwner";
import { useGetNamePrice } from "../../hooks/useGetNamePrice";
import useDebounce from "../../hooks/useDebounce";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button";
import { useRegisterName } from "../../hooks/useRegisterName";
import { ethers } from "ethers";
import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber";
import LoadingIndicator from "../LoadingIndicator";

const FormSchema = z.object({
  nameToRegister: z.string().min(1, "Name must be at least 1 character"),
  yearsToRegister: z.number({
    invalid_type_error: "Please enter a number",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const RegisterNameForm: FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const userNameInput = watch("nameToRegister");
  const userYearInput = watch("yearsToRegister");
  const debouncedValue = useDebounce<string>(userNameInput, 500);
  const { data: namePrice } = useGetNamePrice(debouncedValue);
  const { data } = useFindNameOwner(debouncedValue);

  const nameOwner = data;

  useEffect(() => {
    if (
      nameOwner !== "0x0000000000000000000000000000000000000000" &&
      debouncedValue != "" &&
      debouncedValue
    ) {
      setError("nameToRegister", {
        type: "manual",
        message: "Name is taken",
      });
    } else {
      setError("nameToRegister", {
        type: "manual",
        message: "",
      });
    }
  }, [nameOwner, setError]);

  const { write, isLoading, waitForTransaction } = useRegisterName(
    debouncedValue,
    userYearInput
  );

  const { isFetching } = waitForTransaction;

  const onSubmit: SubmitHandler<FormSchemaType> = async () => {
    if (!write) return;

    write();
  };

  const inputClasses =
    "m-2 block w-full min-w-0 flex-1 rounded-none bg-gray-900 px-2 py-2 text-left align-middle text-white placeholder-gray-500 focus:outline-none sm:text-sm";

  const displayPrice = isBigNumberish(namePrice)
    ? parseFloat(ethers.utils.formatEther(namePrice)).toFixed(2)
    : "";

  return (
    <div>
      {debouncedValue != "" && debouncedValue && (
        <h1>
          &apos;{debouncedValue}&apos; costs {displayPrice} Canto per year
        </h1>
      )}
      <form
        className=" m-auto mt-10 w-full max-w-lg border py-10 px-10 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          className={inputClasses}
          placeholder="name to register"
          {...register("nameToRegister", {
            required: true,
          })}
          disabled={isSubmitting}
        />
        {errors.nameToRegister && (
          <span className="m-2">{errors.nameToRegister.message}</span>
        )}

        <input
          className={inputClasses}
          placeholder={"years to register"}
          {...register("yearsToRegister", {
            required: true,
            valueAsNumber: true,
          })}
          disabled={isSubmitting}
        />
        {/* errors will return when field validation fails  */}
        {errors.yearsToRegister && (
          <span className="m-2">{errors.yearsToRegister.message}</span>
        )}

        <div className="m-2" />

        {(isSubmitting || isLoading || isFetching) && <LoadingIndicator />}
        {errors?.nameToRegister?.message === "" && !errors.yearsToRegister && (
          <Button
            text="Submit"
            type="submit"
            disabled={isSubmitting || !write}
          />
        )}
      </form>
    </div>
  );
};

export default RegisterNameForm;
