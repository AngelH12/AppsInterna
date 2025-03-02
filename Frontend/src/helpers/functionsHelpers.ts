import { OptionSelect } from "Common/Components";
import { TFunction } from "i18next";
import * as Yup from "yup";

export enum userType {
  adminitrador = "administrador",
  empresa = "empresa",
  sucursal = "sucursal",
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

/**
 * @description This function validate if the user type in session is permited
 * @param {userType[]} usersPermited - Array of user types permited
 * @returns {boolean} - Return true if the user type in session is permited
 * @example validateUserTypePermited([userType.adminitrador])
 * @example validateUserTypePermited([userType.adminitrador, userType.empresa])
 */

export const validateUserTypePermited = (usersPermited: userType[]) => {
};

/**
 * @description This function return the default value for select component
 * @param {OptionSelect[]} options - Array of options
 * @param {string} value - Value to compare
 * @returns {OptionSelect} - Return the default value of type OptionsSelect for select component
 * @example getDefaultValueForSelect(options, value)
 */

export const getDefaultValueForSelect = (
  options: OptionSelect[],
  value: string
) => options.find((option) => option.value === value);

/**
 * Validate a string with special characters
 * @param t Translation function
 * @param admitedNumbers If true, numbers are allowed
 * @returns Yup.validateMethod<string>
 * @example
 * validateYupStringWithSpecialCharacters(t)
 *
 *
 *
 **/
export const validateYupStringWithSpecialCharacters = (
  t: TFunction<"translation", undefined>,
  admitedNumbers: boolean = false
) => {
  const regex = admitedNumbers ? /^[A-Za-z0-9\s]+$/ : /^[A-Za-z\s]+$/;

  return Yup.string()
    .test("no-leading-spaces", t("validationForms.noLeadingSpaces"), (val) => {
      if (val) {
        return !/^\s/.test(val); // validate no leading spaces
      }
      return true;
    })
    .test("only-letters", t("validationForms.onlyLetters"), (val) => {
      if (val) {
        return regex.test(val);
      }
      return true;
    })
    .required(t("validationForms.required"));
};
