import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BlogListing from "@/pages/blog-listing";
import BlogPost from "@/pages/blog-post";
import BlogList from "@/pages/admin/blog-list";
import BlogEditor from "@/pages/admin/blog-editor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogListing} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/admin/blogs" component={BlogList} />
      <Route path="/admin/blog/new" component={BlogEditor} />
      <Route path="/admin/blog/edit/:id" component={BlogEditor} />
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-400">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
