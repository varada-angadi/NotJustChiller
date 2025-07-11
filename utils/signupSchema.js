
import * as Yup from "yup";
const validationSchema=Yup.object().shape({
    name: Yup.string()
    .required("Name is required"),

    email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

    password: Yup.string()
    .required("Password is required")
    .min(6,"Password must be 6 characters long"),
})

export default validationSchema;