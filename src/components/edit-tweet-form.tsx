import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface EditITweet {
  id: string;
  photo?: string;
  tweet: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
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

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
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

export default function EditTweetForm({
  /* photo, */
  tweet,
  id,
  setIsEditing,
}: EditITweet) {
  const [isLoading, setLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    const ok = confirm("수정할려?");
    if (!ok || !user || isLoading || editTweet === "" || tweet.length > 180)
      return;
    try {
      setLoading(true);
      const tweetRef = doc(db, "tweets", id);
      // console.log("tweetRef==",tweetRef);
      updateDoc(tweetRef, {
        tweet: editTweet,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        updateDoc(tweetRef, {
          photo: url,
        });
      }
      setEditTweet("");
      setFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onEdit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor={`file${id}`}>
        {file ? "Photo Edited ㅇ" : "Edit photo"}
      </AttachFileButton>

      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id={`file${id}`}
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Editing..." : "Edit Tweet"}
      />
    </Form>
  );
}
