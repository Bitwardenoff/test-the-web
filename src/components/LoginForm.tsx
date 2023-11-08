import { useMemo, useState, SetStateAction } from "react";

const FormSteps = {
  Username: "username",
  Email: "email",
  Password: "password",
};

type FormSteps = (typeof FormSteps)[keyof typeof FormSteps];

export function LoginForm({
  action,
  isMultiStep = false,
}: {
  action: string;
  isMultiStep?: boolean;
}): JSX.Element {
  const [formValues, setFormValues] = useState({});
  const [currentFormStep, setCurrentFormStep] =
    useState<SetStateAction<FormSteps | undefined>>();

  useMemo(() => {
    switch (currentFormStep) {
      case FormSteps.Username:
        setCurrentFormStep(FormSteps.Email);
        break;
      case FormSteps.Email:
        setCurrentFormStep(FormSteps.Password);
        break;
      case FormSteps.Password:
        submitFormData(action, formValues);
        break;
      default:
        setCurrentFormStep(FormSteps.Username);
        break;
    }
  }, [formValues]);

  function handleFormStep(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    setFormValues({ ...formValues, ...Object.fromEntries(formData as any) });
  }

  return isMultiStep ? (
    <form className="card__body" onSubmit={handleFormStep}>
      {currentFormStep === FormSteps.Username ? (
        <UsernameInput />
      ) : currentFormStep === FormSteps.Email ? (
        <EmailInput />
      ) : currentFormStep === FormSteps.Password ? (
        <PasswordInput />
      ) : (
        <p>Welcome! Please click the "next" button to proceed.</p>
      )}

      <FormButton
        label={currentFormStep === FormSteps.Password ? "Submit" : "Next"}
      />
    </form>
  ) : (
    <form className="card__body" method="POST" action="/login">
      <input
        type="hidden"
        name="_token"
        value="abcdefghijklmnopqrstuvwxyz1234567890"
      />
      <UsernameInput />
      <EmailInput />
      <PasswordInput />
      <div className="row">
        <FormButton label="Login" />
      </div>
    </form>
  );
}

function UsernameInput() {
  return (
    <div className="row margin-bottom--md">
      <label htmlFor="username" className="margin-right--sm">
        Username
      </label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="e.g. jsmith"
        required
      />
    </div>
  );
}

function EmailInput() {
  return (
    <div className="row margin-bottom--md">
      <label htmlFor="email" className="margin-right--sm">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="e.g. jsmith@example.com"
        required
      />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="row margin-bottom--md">
      <label htmlFor="password" className="margin-right--sm">
        Password
      </label>
      <input type="password" name="password" id="password" required />
    </div>
  );
}

function FormButton({ label }: { label: string }) {
  return (
    <div className="row">
      <button type="submit" className="button button--primary">
        {label}
      </button>
    </div>
  );
}

function submitFormData(action, data) {
  fetch(action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(({ url }) => {
    if (url) {
      window.location.href = url;
    }
  });
}
