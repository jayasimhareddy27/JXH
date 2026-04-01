"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { hydrateCoverLetters } from "./slice";
export default function CoverLetterPersistence() {
  const dispatch = useDispatch();
  const cl = useSelector((state) => state.coverlettercrud);

  useEffect(() => {
    const saved = localStorage.getItem("jxc_coverletters");
    if (saved) {
      dispatch(hydrateCoverLetters(JSON.parse(saved)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (cl.allCoverletters.length > 0) {
      localStorage.setItem("jxc_coverletters", JSON.stringify(cl));
    }
  }, [cl]);

  return null;
}