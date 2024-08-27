import { useState } from "react";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

export interface EditIName {
  username: string;
  setIsNameEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.input`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const SubmitBtn = styled.input`
  background-color: blue;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditNameForm({
  username,
  setIsNameEditing,
}: EditIName) {
  const [isLoading, setLoading] = useState(false);
  const [editName, setEditName] = useState(username);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const onEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    const ok = confirm("이름변경?");
    if (!ok || !user || isLoading || username === "" || username.length > 10)
      return;
    try {
      setLoading(true);
      await updateProfile(user, {
        displayName: editName,
      });

      setEditName("");
      setIsNameEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onEdit}>
      <TextArea maxLength={180} onChange={onChange} value={editName} />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Editing..." : "Edit Name"}
      />
    </Form>
  );
}
