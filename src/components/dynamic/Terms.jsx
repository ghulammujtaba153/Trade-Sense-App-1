"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Redo,
  Undo,
  Title,
  Link as LinkIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
} from "@mui/icons-material";

import axios from "axios";
import { API_URL } from "@/configs/url";
import { useEffect, useState } from "react";
import PageLoader from "../loaders/PageLoader";
import { toast } from "react-toastify";

export default function Terms() {
  const [data, setData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setData((prev) => ({ ...prev, content: html }));
    },
  });

  const fetchTerms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/terms`);
      setData(res.data ?? { title: "", content: "" });
      editor?.commands.setContent(res.data.content || "");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editor) fetchTerms();
    return () => editor?.destroy();
  }, [editor]);

  const setLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/api/terms`, data);
      toast.success("Terms updated successfully");
      fetchTerms();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !editor) return <PageLoader />;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "800px", mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" mb={2}>
        Manage Terms & Conditions
      </Typography>

      <TextField
        name="title"
        label="Title"
        fullWidth
        value={data.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Toolbar with background color */}
      <Stack
        direction="row"
        spacing={1}
        mb={2}
        flexWrap="wrap"
        sx={{
          backgroundColor: "#f0f0f0",
          p: 1,
          borderRadius: 1,
        }}
      >
        <Button onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold /></Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic /></Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlined /></Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Title fontSize="small" /> H1</Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Title fontSize="small" /> H2</Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted /></Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumbered /></Button>
        <Button onClick={setLink}><LinkIcon /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("left").run()}><FormatAlignLeft /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("center").run()}><FormatAlignCenter /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("right").run()}><FormatAlignRight /></Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("justify").run()}><FormatAlignJustify /></Button>
        <Button onClick={() => editor.chain().focus().undo().run()}><Undo /></Button>
        <Button onClick={() => editor.chain().focus().redo().run()}><Redo /></Button>
      </Stack>

      {/* Editor with increased height */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "12px",
          minHeight: "300px",
          mb: 2,
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Save Terms"}
      </Button>
    </Box>
  );
}
