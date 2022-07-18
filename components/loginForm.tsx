import { Formik, Field, Form, FormikHelpers } from "formik";
import styles from "./login-form.module.css";

interface Values {
  email: string;
  password: string;
}

type LoginFormPRopTypes = {
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
  onSignUp: () => void;
  onAnimations: () => void;
};

export default function LoginForm({
  onSubmit,
  onSignUp,
  onAnimations,
}: LoginFormPRopTypes) {
  return (
    <div className={styles.login_box + " p-3"}>
      <h1 className="display-6 mb-3">Login</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          if (values.email && values.password) {
            onSubmit(values);
            setSubmitting(false);
          }
        }}
      >
        <Form>
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
              Login
            </button>
            <button className="btn btn-primary" onClick={onSignUp}>
              Sign up
            </button>
            <button className="btn btn-secondary" onClick={onAnimations}>
              Animations
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
