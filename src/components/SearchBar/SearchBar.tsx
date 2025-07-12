import styles from "./SearchBar.module.css";
// import { useId } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import toast, { Toaster } from "react-hot-toast";

interface SearchBarValues {
  query: string;
}

const formValues: SearchBarValues = {
  query: "",
};

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = async (
    values: SearchBarValues,
    formikHelpers: FormikHelpers<SearchBarValues>
  ) => {
    if (values.query.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(values.query);
    formikHelpers.resetForm();
  };

  return (
    <header className={styles.header}>
      <Toaster />
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <Formik initialValues={formValues} onSubmit={handleSubmit}>
          <Form className={styles.form}>
            <Field
              className={styles.input}
              type="text"
              name="query"
              autoComplete="off"
              placeholder="Search movies..."
              autoFocus
            />
            <button className={styles.button} type="submit">
              Search
            </button>
          </Form>
        </Formik>
      </div>
    </header>
  );
}
