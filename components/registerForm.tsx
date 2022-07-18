import { Formik, Field, Form, FormikHelpers } from "formik";
import styles from "./login-form.module.css";

interface Values {
  name: string,
  email: string;
  password: string;
}

type LoginFormPRopTypes = {
  onSubmit: ({ name, email, password }: { name: string, email: string; password: string }) => void;
  onLogin: () => void;
};

export default function RegisterForm({ onSubmit, onLogin }: LoginFormPRopTypes) {
  return (
    <div className={styles.login_box + " p-3"}>
      <h1 className="display-6 mb-3">Sign Up</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          onSubmit(values);
          setSubmitting(false);
        }}
      >
        <Form>
        <div className="mb-3">
            <Field
              className="form-control"
              id="name"
              name="name"
              placeholder="name"
            />
          </div>
          <div className="mb-3">
            <Field
              className="form-control"
              id="email"
              name="email"
              placeholder="email"
              type="email"
            />
          </div>

          <div className="mb-3">
            <Field
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>

          
          <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Sign up
          </button>
          <button type="submit" className="btn btn-primary" onClick={onLogin}>
            Login
          </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
