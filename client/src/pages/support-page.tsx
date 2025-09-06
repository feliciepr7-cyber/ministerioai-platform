import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Form schema for creating tickets
const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  on_hold: "bg-gray-100 text-gray-800",
  resolved: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-800",
};

const STATUS_ICONS = {
  open: Clock,
  in_progress: AlertCircle,
  on_hold: XCircle,
  resolved: CheckCircle,
  closed: CheckCircle,
};

export default function SupportPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ticket categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/tickets/categories"],
    queryFn: async () => {
      const response = await fetch("/api/tickets/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Fetch user's tickets
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/tickets"],
    queryFn: async () => {
      const response = await fetch("/api/tickets");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
  });

  // Create ticket form
  const form = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
    },
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketForm) => {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create ticket");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
      });
      form.reset();
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateTicketForm) => {
    createTicketMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
          <p className="text-muted-foreground">
            Need help? Create a support ticket and our team will assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Ticket Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showCreateForm ? (
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    className="w-full"
                    data-testid="button-create-ticket"
                  >
                    Create Support Ticket
                  </Button>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <input
                        {...form.register("title")}
                        className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Brief description of your issue"
                        data-testid="input-ticket-title"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select onValueChange={(value) => form.setValue("categoryId", value)}>
                        <SelectTrigger className="mt-1" data-testid="select-ticket-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories as any[]).map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.categoryId && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.categoryId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select onValueChange={(value) => form.setValue("priority", value as any)}>
                        <SelectTrigger className="mt-1" data-testid="select-ticket-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        {...form.register("description")}
                        className="mt-1 min-h-[100px]"
                        placeholder="Please describe your issue in detail..."
                        data-testid="textarea-ticket-description"
                      />
                      {form.formState.errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createTicketMutation.isPending}
                        data-testid="button-submit-ticket"
                      >
                        {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                        data-testid="button-cancel-ticket"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Your Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse">Loading tickets...</div>
                  </div>
                ) : (tickets as any[]).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No support tickets yet.</p>
                    <p className="text-sm">Create your first ticket to get help from our support team.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(tickets as any[]).map((ticket: any) => {
                      const StatusIcon = STATUS_ICONS[ticket.status as keyof typeof STATUS_ICONS];
                      return (
                        <div 
                          key={ticket.id} 
                          className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                          data-testid={`ticket-${ticket.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm text-muted-foreground">
                                  {ticket.ticketNumber}
                                </span>
                                <Badge className={STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS]}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {ticket.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={PRIORITY_COLORS[ticket.priority as keyof typeof PRIORITY_COLORS]}>
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-foreground mb-1">{ticket.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="text-xs text-muted-foreground mt-2">
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}