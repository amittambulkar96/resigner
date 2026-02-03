"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download, FileText, Eye, Edit3, RefreshCw,
  Bold, Italic, List, ListOrdered,
  Undo, Redo, Type, Quote
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { exportEditorContentToPDF } from "@/lib/pdf-export";

// Sample templates with {{placeholder}} format
const sampleTemplates = [
  {
    _id: "mock-1",
    title: "Professional Resignation",
    content: `Dear {{manager_name}},

I am writing to formally notify you of my resignation from my position as {{job_title}} at {{company_name}}, effective {{last_working_day}}.

I have accepted an opportunity that aligns more closely with my career goals. I want to express my sincere gratitude for the professional growth and experiences I've gained during my tenure here. The skills and knowledge I've acquired will undoubtedly contribute to my future endeavors.

I am committed to ensuring a smooth transition and will complete all pending projects and handover documentation before my departure. Please let me know how I can assist during this transition period.

Thank you for your understanding and support.

Sincerely,
{{your_name}}`,
    category: "professional",
    createdAt: Date.now(),
  },
  {
    _id: "mock-2",
    title: "Friendly Resignation",
    content: `Hi {{manager_name}},

I wanted to let you know that I'll be moving on from my role as {{job_title}} at {{company_name}}. My last day will be {{last_working_day}}.

It's been a wonderful experience working here, and I've genuinely enjoyed being part of such a great team. While I'm excited about this new chapter, I'll definitely miss the collaborative environment and friendships we've built.

I'm happy to help train my replacement and wrap up my current projects. Let's stay in touch!

Wishing the team continued success.

Best regards,
{{your_name}}`,
    category: "friendly",
    createdAt: Date.now(),
  },
  {
    _id: "mock-3",
    title: "Short Notice Resignation",
    content: `Dear {{manager_name}},

Please accept this letter as formal notice of my resignation from my position as {{job_title}} at {{company_name}}, effective immediately.

Due to unforeseen circumstances, I am unable to continue in my current role. I apologize for any inconvenience this may cause.

I appreciate the opportunities provided during my time here.

Regards,
{{your_name}}`,
    category: "short",
    createdAt: Date.now(),
  },
];

interface Template {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
}

// Format toolbar component
function FormatToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-gray-50 dark:bg-gray-800 flex-wrap overflow-x-auto touch-manipulation min-h-[44px]">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Bold"
      >
        <Bold className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Italic"
      >
        <Italic className="h-5 w-5" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-0.5 hidden sm:block" />
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Bullet List"
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Numbered List"
      >
        <ListOrdered className="h-5 w-5" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-0.5 hidden sm:block" />
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Heading 1"
      >
        <Type className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Heading 2"
      >
        <Type className="h-5 w-5 text-xs" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        className={`flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9 ${editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""}`}
        title="Quote"
      >
        <Quote className="h-5 w-5" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-0.5 hidden sm:block" />
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().undo()}
        className="flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9"
        title="Undo"
      >
        <Undo className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().redo()}
        className="flex-shrink-0 touch-manipulation h-10 w-10 sm:h-9 sm:w-9"
        title="Redo"
      >
        <Redo className="h-5 w-5" />
      </Button>
    </div>
  );
}

// Helper function to convert {{placeholders}} to highlighted format
const processContent = (content: string) => {
  return content.replace(/\{\{(\w+)\}\}/g, '<span data-placeholder class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded font-semibold text-yellow-800 dark:text-yellow-200">$1</span>');
};

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filter, setFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    // Load templates on mount
    setTimeout(() => {
      setTemplates(sampleTemplates);
      setIsLoading(false);
    }, 0);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing your resignation letter here...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] sm:min-h-[400px] p-3 sm:p-4",
      },
    },
    editable: false,
    onUpdate: ({ editor }) => {
      // Update real-time preview
      setEditorContent(editor.getHTML());
    },
  });

  const filteredTemplates = templates.filter(
    (t) => filter === "all" || t.category === filter
  );

  const loadTemplate = (template: Template) => {
    setSelectedTemplate(template);
    // Process placeholders before setting content
    const processedContent = processContent(template.content);
    editor?.commands.setContent(processedContent);
    editor?.setEditable(false);
    setIsEditing(false);
    setEditorContent(processedContent);
  };

  const handleEdit = () => {
    setIsEditing(true);
    editor?.setEditable(true);
  };

  const handlePreview = () => {
    setIsEditing(false);
    editor?.setEditable(false);
    // Update preview with current content
    if (editor) {
      setEditorContent(editor.getHTML());
    }
  };

  const exportToPDF = () => {
    if (!editor) return;
    
    exportEditorContentToPDF(editor, {
      title: selectedTemplate?.title || "Resignation Letter",
      filename: "resignation-letter.pdf",
      showPageNumbers: true,
      showDate: true,
      showWatermark: true,
    });
  };

  const handleSeedTemplates = () => {
    setTemplates(sampleTemplates);
  };

  const categories = ["all", "professional", "friendly", "short"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold truncate">Resigner</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={handleSeedTemplates}
              className="text-xs sm:text-sm px-2 sm:px-3 h-9 sm:h-10"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Template Gallery */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Templates</span>
                  <span className="sm:hidden">Gallery</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Choose a template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Filter by type</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All templates" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="h-[250px] sm:h-[350px] md:h-[500px] overflow-y-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="grid grid-cols-1 gap-3">
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading templates...
                      </div>
                    ) : filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <div
                          key={template._id}
                          className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md touch-manipulation active:scale-[0.98] ${
                            selectedTemplate?._id === template._id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => loadTemplate(template)}
                        >
                          <h3 className="font-medium text-sm sm:text-base">{template.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 capitalize">
                            {template.category}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No templates found. Click &quot;Reset Templates&quot; to restore sample templates.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor / Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {selectedTemplate
                        ? selectedTemplate.title
                        : "Select a Template"}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm truncate">
                      {selectedTemplate
                        ? "Edit your resignation letter"
                        : "Choose a template to get started"}
                    </CardDescription>
                  </div>
                  {selectedTemplate && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Edit/Preview Toggle */}
                      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 sm:p-1">
                        <Button
                          variant={!isEditing ? "default" : "ghost"}
                          size="sm"
                          onClick={handlePreview}
                          className={`text-xs sm:text-sm px-2 sm:px-3 ${!isEditing ? "" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          <span className="hidden xs:inline">Preview</span>
                        </Button>
                        <Button
                          variant={isEditing ? "default" : "ghost"}
                          size="sm"
                          onClick={handleEdit}
                          className={`text-xs sm:text-sm px-2 sm:px-3 ${isEditing ? "" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          <span className="hidden xs:inline">Edit</span>
                        </Button>
                      </div>
                      <Button size="sm" onClick={exportToPDF} variant="outline" className="text-xs sm:text-sm">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Export PDF</span>
                        <span className="sm:hidden">PDF</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedTemplate ? (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Formatting Toolbar - only visible in edit mode */}
                    {isEditing && editor && <FormatToolbar editor={editor} />}
                    
                    {/* Single Editor/Preview Area */}
                    <div className="border rounded-lg bg-white dark:bg-gray-900 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden">
                      {isEditing ? (
                        <>
                          <div className="p-2 border-b bg-gray-50 dark:bg-gray-800">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                              Edit Mode
                            </span>
                          </div>
                          <div className="touch-manipulation">
                            <EditorContent editor={editor} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 border-b bg-gray-50 dark:bg-gray-800">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                              Preview
                            </span>
                          </div>
                          <div 
                            className="p-3 sm:p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
                            dangerouslySetInnerHTML={{ __html: editorContent }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] text-gray-400">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Select a template to start</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
