"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
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
  Close,
  Code,
} from "@mui/icons-material";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/configs/url";
import PageLoader from "../loaders/PageLoader";


export default function TermsModal({ data: initialData, onClose, onSuccess }) {
  const [data, setData] = useState(initialData || { title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialData?.content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setData((prev) => ({ ...prev, content: html }));
    },
  });

  useEffect(() => {
    if (editor && initialData?.content) {
      editor.commands.setContent(initialData.content);
    }
  }, [editor, initialData]);

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
      if (initialData?._id) {
        await axios.put(`${API_URL}/api/terms/${initialData._id}`, data);
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/api/terms`, data);
        toast.success("Created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!editor) return <PageLoader />;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialData ? "Edit Terms & Conditions" : "Add Terms & Conditions"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={data.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {/* Toolbar */}
          {!showSource && (
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
          )}

          {/* Source Code Toggle Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<Code />}
              variant="outlined"
              onClick={() => {
                if (!showSource) {
                  setSourceCode(editor.getHTML());
                } else {
                  editor.commands.setContent(sourceCode);
                }
                setShowSource(!showSource);
              }}
            >
              {showSource ? "Back to Editor" : "View Source Code"}
            </Button>
          </Box>

          {/* Editor or Source Code */}
          {showSource ? (
            <TextField
              multiline
              fullWidth
              minRows={10}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              sx={{
                fontFamily: "monospace",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "12px",
                mb: 2,
              }}
            />
          ) : (
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
          )}

          {/* Action Buttons */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={onClose} color="p">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
