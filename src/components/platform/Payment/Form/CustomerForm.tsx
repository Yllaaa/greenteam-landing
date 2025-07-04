import { UseFormRegister, FieldErrors } from "react-hook-form";
import styles from "./payment-form.module.scss";

type FormData = {
  name: string;
  email: string;
  address: string;
};

type CustomerFormProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

export default function CustomerForm({ register, errors }: CustomerFormProps) {
  return (
    <div className={styles.formSection}>
      <h2>Personal details</h2>

      <div className={styles.formGroupSection}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className={errors.name ? styles.inputError : ""}
            {...register("name")}
          />
          {errors.name && (
            <p className={styles.errorText}>{errors.name.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className={errors.email ? styles.inputError : ""}
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.errorText}>{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
