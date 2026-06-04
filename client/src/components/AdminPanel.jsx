import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/useTheme';
import TinyEditor from '../components/TinyEditor';
import {
  FiUsers,
  FiStar,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiSettings,
  FiBarChart2,
  FiGrid,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiSend,
  FiDownload,
  FiPlus,
  FiBook,
  FiHelpCircle,
  FiDollarSign,
  FiBox
} from "react-icons/fi";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pages, setPages] = useState([]);
  const [emails, setEmails] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewResponse, setReviewResponse] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { theme, themes } = useTheme();
  const currentTheme = themes[theme];
  const [editingPricing, setEditingPricing] = useState(null);
const [isEditingPricing, setIsEditingPricing] = useState(false);
const [isUpdatingPricing, setIsUpdatingPricing] = useState(false);
  const [subscriptionStats, setSubscriptionStats] = useState({ free: 0, pro: 0, premium: 0 });
const [pricingPlansWithSubscribers, setPricingPlansWithSubscribers] = useState([]);

  // Form states for different sections
  const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', category: '' });
  const [featureForm, setFeatureForm] = useState({ title: '', description: '', icon: '' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general' });
  const [pricingForm, setPricingForm] = useState({
    name: '',
    description: '',
    monthlyPrice: '',
    yearlyPrice: ''
  });
  const [guideForm, setGuideForm] = useState({
    _id: '',
    title: '',
    content: '',
    category: 'getting-started',
    difficulty: 'beginner',
    description: '',
    tags: [],
    newTag: '',
    status: 'draft'
  });
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Testing API connection...");

        // Test a simple endpoint first
        const testResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("API connection successful", testResponse.data);

      } catch (error) {
        console.error("API connection failed", error);
        if (error.response?.status === 401) {
          toast.error("Please login again");
        }
      }
    };

    if (activeTab === 'guides') {
      testApiConnection();
    }
  }, [activeTab]);

  useEffect(() => {
  fetchStats();
  if (activeTab === 'users') fetchUsers();
  if (activeTab === 'reviews') fetchReviews();
  if (activeTab === 'contacts') fetchContacts();
  if (activeTab === 'pages') fetchPages();
  if (activeTab === 'emails') fetchEmails();
  if (activeTab === 'blogs') fetchBlogs();
  if (activeTab === 'features') fetchFeatures();
  if (activeTab === 'faqs') fetchFaqs();
  if (activeTab === 'pricing') {
    fetchPricingPlans();
    fetchPricingPlansWithSubscribers();
  }
  if (activeTab === 'guides') fetchGuides();
}, [activeTab]);

 const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStats(data);
    if (data.subscriptions) {
      setSubscriptionStats(data.subscriptions);
    }
  } catch (err) {
    console.error("Failed to fetch stats", err);
  } finally {
    setLoading(false);
  }
};

  
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to load users");
    }
  };
  // Fetch pricing plans with subscriber counts
const fetchPricingPlansWithSubscribers = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing-with-subscribers`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPricingPlansWithSubscribers(data);
  } catch (err) {
    console.error("Failed to fetch pricing plans with subscribers", err);
  }
};

  const fetchReviews = async () => {

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(data.reviews);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      toast.error("Failed to load reviews");
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/contacts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
      toast.error("Failed to load contacts");
    }
  };

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPages(data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
      toast.error("Failed to load pages");
    }
  };

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/emails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      const processedEmails = Array.isArray(data) ? data : [];

      setEmails(processedEmails);
    } catch (err) {
      console.error("Failed to fetch emails", err);
      toast.error("Failed to load emails");
      setEmails([]);
    }
  };

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/blogs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      toast.error("Failed to load blogs");
    }
  };

  const fetchFeatures = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/features`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeatures(data);
    } catch (err) {
      console.error("Failed to fetch features", err);
      toast.error("Failed to load features");
    }
  };

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/faqs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFaqs(data);
    } catch (err) {
      console.error("Failed to fetch FAQs", err);
      toast.error("Failed to load FAQs");
    }
  };

  const fetchPricingPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPricingPlans(data);
    } catch (err) {
      console.error("Failed to fetch pricing plans", err);
      toast.error("Failed to load pricing plans");
    }
  };
  const handleApiError = (error, defaultMessage) => {
    console.error(defaultMessage, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (status === 404) {
        toast.error("Resource not found. Please check the API endpoint.");
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(defaultMessage);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(defaultMessage);
    }
  };

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/guides`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGuides(data);
    } catch (err) {
      handleApiError(err, "Failed to load guides");
      setGuides([]);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
      toast.error("Failed to update user role");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
        toast.error("Failed to delete user");
      }
    }
  };

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/${reviewId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Review ${status} successfully`);
      fetchReviews();
    } catch (err) {
      console.error("Failed to update review status", err);
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${reviewId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Review deleted successfully");
        fetchReviews();
      } catch (err) {
        console.error("Failed to delete review", err);
        toast.error("Failed to delete review");
      }
    }
  };

  const sendReviewResponse = async () => {
    if (!reviewResponse.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${selectedReview._id}/response`,
        { message: reviewResponse },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Response sent successfully");
      setSelectedReview(null);
      setReviewResponse("");
      fetchReviews();
    } catch (err) {
      console.error("Failed to send response", err);
      toast.error("Failed to send response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReviewFeatured = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/reviews/${reviewId}/featured`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Featured status updated");
      fetchReviews();
    } catch (err) {
      console.error("Failed to toggle featured", err);
      toast.error("Failed to update featured status");
    }
  };

  const createPage = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages`,
        {
          ...pageForm,
          content: pageForm.content
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Page created successfully");
      setPageForm({ title: '', slug: '', content: '' });
      fetchPages();
    } catch (err) {
      console.error("Failed to create page", err);
      if (err.response?.status === 409) {
        toast.error("A page with this slug already exists");
      } else {
        toast.error("Failed to create page");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const updatePageStatus = async (pageId, isPublished) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages/${pageId}/status`,
        { isPublished },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Page ${isPublished ? 'published' : 'unpublished'} successfully`);
      fetchPages();
    } catch (err) {
      console.error("Failed to update page status", err);
      toast.error("Failed to update page");
    }
  };

  const deletePage = async (pageId) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/pages/${pageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Page deleted successfully");
        fetchPages();
      } catch (err) {
        console.error("Failed to delete page", err);
        toast.error("Failed to delete page");
      }
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error("Please enter subject and content");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/emails/bulk`,
        {
          subject: emailSubject.trim(),
          content: emailContent.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );

      if (response.data?.success) {
        toast.success(`Bulk email sent to ${response.data.recipients || 0} recipients`);
      } else {
        toast.error("Failed to send email: " + (response.data?.error || 'Unknown error'));
      }

      setEmailSubject("");
      setEmailContent("");
      fetchEmails();
    } catch (err) {
      console.error("Failed to send bulk email", err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to send email';
      toast.error(`Failed to send email: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const createBlog = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/blogs`,
        {
          ...blogForm,
          content: blogForm.content // HTML content
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Blog created successfully");
      setBlogForm({ title: '', content: '', category: '' });
      fetchBlogs();
    } catch (err) {
      console.error("Failed to create blog", err);
      toast.error("Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createFeature = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/features`,
        featureForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Feature created successfully");
      setFeatureForm({ title: '', description: '', icon: '' });
      fetchFeatures();
    } catch (err) {
      console.error("Failed to create feature", err);
      toast.error("Failed to create feature");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createFaq = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/faqs`,
        faqForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("FAQ created successfully");
      setFaqForm({ question: '', answer: '', category: 'general' });
      fetchFaqs();
    } catch (err) {
      console.error("Failed to create FAQ", err);
      toast.error("Failed to create FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

const createPricingPlan = async (e) => {
  e.preventDefault();
  
  // Validate inputs
  if (!pricingForm.name.trim()) {
    toast.error("Plan name is required");
    return;
  }
  if (!pricingForm.description.trim()) {
    toast.error("Plan description is required");
    return;
  }
  
  // Parse and validate price values
  const monthlyPrice = parseFloat(pricingForm.monthlyPrice);
  const yearlyPrice = parseFloat(pricingForm.yearlyPrice);
  
  if (isNaN(monthlyPrice)) {
    toast.error("Please enter a valid monthly price");
    return;
  }
  if (isNaN(yearlyPrice)) {
    toast.error("Please enter a valid yearly price");
    return;
  }
  
  try {
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    // Send data in the format expected by admin.js
    const planData = {
      name: pricingForm.name.trim(),
      description: pricingForm.description.trim(),
      monthlyPrice: monthlyPrice,  // Send as direct field
      yearlyPrice: yearlyPrice     // Send as direct field
    };
    
    console.log("Sending pricing data:", planData);
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing`,
      planData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    toast.success("Pricing plan created successfully");
    
    // Reset form
    setPricingForm({ 
      name: '', 
      description: '', 
      monthlyPrice: '', 
      yearlyPrice: '' 
    });
    
    // Refresh the list
    fetchPricingPlans();
    
  } catch (err) {
    console.error("Failed to create pricing plan:", err);
    const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create pricing plan";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
// Update pricing plan
const updatePricingPlan = async (e) => {
  e.preventDefault();
  
  if (!editingPricing) return;
  
  // Validate inputs
  if (!pricingForm.name.trim()) {
    toast.error("Plan name is required");
    return;
  }
  if (!pricingForm.description.trim()) {
    toast.error("Plan description is required");
    return;
  }
  
  // Parse and validate price values
  const monthlyPrice = parseFloat(pricingForm.monthlyPrice);
  const yearlyPrice = parseFloat(pricingForm.yearlyPrice);
  
  if (isNaN(monthlyPrice)) {
    toast.error("Please enter a valid monthly price");
    return;
  }
  if (isNaN(yearlyPrice)) {
    toast.error("Please enter a valid yearly price");
    return;
  }
  
  try {
    setIsUpdatingPricing(true);
    const token = localStorage.getItem("token");
    
    const planData = {
      name: pricingForm.name.trim(),
      description: pricingForm.description.trim(),
      monthlyPrice: monthlyPrice,
      yearlyPrice: yearlyPrice,
      isActive: pricingForm.isActive !== undefined ? pricingForm.isActive : true,
      isPopular: pricingForm.isPopular || false,
      order: pricingForm.order || 0
    };
    
    console.log("Updating pricing plan:", planData);
    
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing/${editingPricing._id}`,
      planData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    toast.success("Pricing plan updated successfully");
    
    // Reset editing state
    cancelPricingEdit();
    
    // Refresh the list
    fetchPricingPlans();
    
  } catch (err) {
    console.error("Failed to update pricing plan:", err);
    const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to update pricing plan";
    toast.error(errorMessage);
  } finally {
    setIsUpdatingPricing(false);
  }
};

// Delete pricing plan
const deletePricingPlan = async (planId, planName) => {
  if (window.confirm(`Are you sure you want to delete the "${planName}" pricing plan?`)) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing/${planId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success("Pricing plan deleted successfully");
      
      // If we were editing this plan, cancel edit
      if (editingPricing?._id === planId) {
        cancelPricingEdit();
      }
      
      // Refresh the list
      fetchPricingPlans();
      
    } catch (err) {
      console.error("Failed to delete pricing plan:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to delete pricing plan";
      toast.error(errorMessage);
    }
  }
};

// Edit pricing plan - populate form with plan data
const editPricingPlan = (plan) => {
  console.log("Edit button clicked for plan:", plan); // Debug log
  
  if (!plan) {
    console.error("No plan data provided");
    toast.error("Cannot edit: No plan data");
    return;
  }
  
  try {
    // Set editing states
    setEditingPricing(plan);
    setIsEditingPricing(true);
    
    // Populate the form with plan data
    setPricingForm({
      name: plan.name || '',
      description: plan.description || '',
      monthlyPrice: plan.price?.monthly || 0,
      yearlyPrice: plan.price?.yearly || 0,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      isPopular: plan.isPopular || false,
      order: plan.order || 0
    });
    
    console.log("Form populated with:", {
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.price?.monthly,
      yearlyPrice: plan.price?.yearly
    });
    
    // Show success message
    toast.info(`Editing plan: ${plan.name}`);
    
    // Scroll to form after a short delay to allow DOM update
    setTimeout(() => {
      const formElement = document.getElementById('pricing-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        // Highlight the form
        formElement.style.transition = 'all 0.3s ease';
        formElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          formElement.style.boxShadow = '';
        }, 2000);
      } else {
        console.error("Form element with id 'pricing-form' not found");
      }
    }, 100);
    
  } catch (error) {
    console.error("Error in editPricingPlan:", error);
    toast.error("Failed to load plan data for editing");
  }
};

// Cancel pricing edit
const cancelPricingEdit = () => {
  console.log("Canceling edit mode"); // Debug log
  setEditingPricing(null);
  setIsEditingPricing(false);
  setPricingForm({ 
    name: '', 
    description: '', 
    monthlyPrice: '', 
    yearlyPrice: '' 
  });
  toast.info("Edit cancelled");
};

// Toggle pricing plan active status
const togglePricingActive = async (plan) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing/${plan._id}/toggle-active`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    toast.success(`Plan ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
    fetchPricingPlans();
    
  } catch (err) {
    console.error("Failed to toggle plan status:", err);
    toast.error("Failed to update plan status");
  }
};

// Toggle pricing plan popular status
const togglePricingPopular = async (plan) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/api/admin/pricing/${plan._id}/popular`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    toast.success(`Plan ${response.data.isPopular ? 'marked as popular' : 'removed from popular'} successfully`);
    fetchPricingPlans();
    
  } catch (err) {
    console.error("Failed to toggle popular status:", err);
    toast.error("Failed to update popular status");
  }
};
  
  const saveGuide = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      // Calculate read time (approx 200 words per minute)
      const wordCount = guideForm.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const guideData = {
        title: guideForm.title,
        content: guideForm.content,
        category: guideForm.category,
        difficulty: guideForm.difficulty,
        excerpt: guideForm.description,
        tags: guideForm.tags,
        readTime,
        status: guideForm.status
      };

      console.log('Sending guide data:', guideData); // DEBUG LOG

      let response;
      if (isEditing) {
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/guides/${guideForm._id}`,
          guideData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Guide updated successfully");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/guides`,
          guideData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Guide created successfully");
      }

      console.log('Server response:', response.data); // DEBUG LOG

      // Reset form
      setGuideForm({
        _id: '',
        title: '',
        content: '',
        category: 'getting-started',
        difficulty: 'beginner',
        description: '',
        tags: [],
        newTag: '',
        status: 'draft'
      });
      setIsEditing(false);
      fetchGuides();
    } catch (err) {
      console.error("Failed to save guide", err);
      console.error("Error details:", err.response?.data); // DEBUG LOG
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} guide: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editGuide = (guide) => {
    setGuideForm({
      _id: guide._id,
      title: guide.title,
      content: guide.content,
      category: guide.category,
      difficulty: guide.difficulty,
      description: guide.excerpt || '',
      tags: guide.tags || [],
      newTag: '',
      status: guide.status
    });
    setIsEditing(true);
    // Scroll to form
    document.getElementById('guide-form').scrollIntoView({ behavior: 'smooth' });
  };
  const cancelEdit = () => {
    setGuideForm({
      _id: '',
      title: '',
      content: '',
      category: 'getting-started',
      difficulty: 'beginner',
      description: '',
      tags: [],
      newTag: '',
      status: 'draft'
    });
    setIsEditing(false);
  };
  const updateGuideStatus = async (guideId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/guides/${guideId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Guide ${newStatus} successfully`);
      fetchGuides();
    } catch (err) {
      console.error("Failed to update guide status", err);
      toast.error(`Failed to update guide status: ${err.response?.data?.error || err.message}`);
    }
  };
  const addTag = () => {
    if (guideForm.newTag.trim()) {
      const newTag = guideForm.newTag.trim();
      if (!guideForm.tags.includes(newTag)) {
        setGuideForm({
          ...guideForm,
          tags: [...guideForm.tags, newTag],
          newTag: ''
        });
      } else {
        toast.error("Tag already exists");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setGuideForm({
      ...guideForm,
      tags: guideForm.tags.filter(tag => tag !== tagToRemove)
    });
  };
  const deleteGuide = async (guideId) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/guides/${guideId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Guide deleted successfully");
        fetchGuides();
      } catch (err) {
        console.error("Failed to delete guide", err);
        toast.error(`Failed to delete guide: ${err.response?.data?.error || err.message}`);
      }
    }
  };
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  const exportData = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/export/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${type} data exported successfully`);
    } catch (err) {
      console.error("Failed to export data", err);
      toast.error("Failed to export data");
    }
  };

  if (loading) {
    return (
      <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${currentTheme.bodyAccent} mx-auto`}></div>
          <p className={`mt-4 ${currentTheme.bodyText}`}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const TabButton = ({ name, icon, label }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === name
        ? `${currentTheme.btnPrimary} text-white`
        : `${currentTheme.btnAccent} hover:${currentTheme.navHover}`
        }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className={`${currentTheme.bodyBg} ${currentTheme.bodyText} min-h-screen py-8 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.headerGradient} bg-clip-text text-transparent`}>
            Admin Panel
          </h1>
          <p className={`mt-2 ${currentTheme.bodyAccent}`}>Complete system management dashboard</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton name="dashboard" icon={<FiBarChart2 />} label="Dashboard" />
          <TabButton name="users" icon={<FiUsers />} label="Users" />
          <TabButton name="reviews" icon={<FiStar />} label="Reviews" />
          <TabButton name="contacts" icon={<FiMessageSquare />} label="Contacts" />
          <TabButton name="pages" icon={<FiFileText />} label="Pages" />
          <TabButton name="blogs" icon={<FiBook />} label="Blogs" />
          <TabButton name="features" icon={<FiBox />} label="Features" />
          <TabButton name="faqs" icon={<FiHelpCircle />} label="FAQs" />
          <TabButton name="pricing" icon={<FiDollarSign />} label="Pricing" />
          <TabButton name="guides" icon={<FiBook />} label="Guides" />
          <TabButton name="emails" icon={<FiMail />} label="Emails" />
          <TabButton name="settings" icon={<FiSettings />} label="Settings" />
        </div>

     {/* Dashboard Tab */}
{activeTab === 'dashboard' && stats && (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiUsers className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold">{stats.totalUsers}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiStar className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
        <h3 className="text-lg font-semibold mb-2">Total Reviews</h3>
        <p className="text-3xl font-bold">{stats.totalReviews}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiMessageSquare className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <h3 className="text-lg font-semibold mb-2">Pending Contacts</h3>
        <p className="text-3xl font-bold">{stats.pendingContacts}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiMail className="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <h3 className="text-lg font-semibold mb-2">Emails Sent</h3>
        <p className="text-3xl font-bold">{stats.emailsSent}</p>
      </div>
    </div>

    {/* Subscription Distribution Section */}
    <div className={`${currentTheme.cardBg} p-6 rounded-lg border mb-8`}>
      <h3 className="text-lg font-semibold mb-4">Subscription Distribution</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl font-bold text-gray-500">{subscriptionStats.free || 0}</div>
          <div className="text-sm text-gray-600 mt-1">Free Plan Users</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gray-500 h-2 rounded-full"
              style={{ width: `${stats.totalUsers ? ((subscriptionStats.free || 0) / stats.totalUsers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-3xl font-bold text-blue-500">{subscriptionStats.pro || 0}</div>
          <div className="text-sm text-gray-600 mt-1">Pro Plan Users</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${stats.totalUsers ? ((subscriptionStats.pro || 0) / stats.totalUsers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-3xl font-bold text-purple-500">{subscriptionStats.premium || 0}</div>
          <div className="text-sm text-gray-600 mt-1">Premium Plan Users</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${stats.totalUsers ? ((subscriptionStats.premium || 0) / stats.totalUsers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    {/* Content Stats Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiBook className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
        <h3 className="text-lg font-semibold mb-2">Blogs</h3>
        <p className="text-3xl font-bold">{stats.totalBlogs || 0}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiBox className="w-8 h-8 mx-auto mb-2 text-orange-500" />
        <h3 className="text-lg font-semibold mb-2">Features</h3>
        <p className="text-3xl font-bold">{stats.totalFeatures || 0}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiHelpCircle className="w-8 h-8 mx-auto mb-2 text-teal-500" />
        <h3 className="text-lg font-semibold mb-2">FAQs</h3>
        <p className="text-3xl font-bold">{stats.totalFaqs || 0}</p>
      </div>
      <div className={`${currentTheme.cardBg} p-6 rounded-lg border text-center`}>
        <FiDollarSign className="w-8 h-8 mx-auto mb-2 text-pink-500" />
        <h3 className="text-lg font-semibold mb-2">Pricing Plans</h3>
        <p className="text-3xl font-bold">{stats.totalPricingPlans || 0}</p>
      </div>
    </div>
  </div>
)}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button
                onClick={() => exportData('users')}
                className={`${currentTheme.btnPrimary} flex items-center px-3 py-1 rounded`}
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Username</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-3">{user.username}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Review Management</h2>
              <button
                onClick={() => exportData('reviews')}
                className={`${currentTheme.btnPrimary} flex items-center px-3 py-1 rounded`}
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{review.user?.username}</h4>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
                  <p className="mb-3">{review.comment}</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateReviewStatus(review._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiX />
                    </button>
                    <button
                      onClick={() => toggleReviewFeatured(review._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {review.isFeatured ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiMessageSquare />
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Contact Messages</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-gray-600">{contact.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-3">{contact.message}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      Reply
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Page Management</h2>
              <button
                onClick={() => exportData('pages')}
                className={`${currentTheme.btnPrimary} flex items-center px-3 py-1 rounded`}
              >
                <FiDownload className="mr-1" /> Export
              </button>
            </div>

            {/* Create Page Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Create New Page</h3>
              <form onSubmit={createPage}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Page Title"
                    value={pageForm.title}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Slug (URL-friendly)"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                 <label className="block text-sm font-medium text-gray-200 mb-2">
                      Page Content
                    </label>
                <TinyEditor
                  className="mt-5"
                  value={pageForm.content}
                  onChange={(content) => setPageForm({ ...pageForm, content })}
                  height={200}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Page'}
                </button>
              </form>
            </div>

            {/* Pages List */}
            <h3 className="font-semibold mb-3">Existing Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <div key={page._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{page.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">/{page.slug}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => updatePageStatus(page._id, !page.isPublished)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {page.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deletePage(page._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Blog Management</h2>

            {/* Create Blog Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Create New Blog Post</h3>
              <form onSubmit={createBlog}>
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <select
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="news">News</option>
                  <option value="tutorials">Tutorials</option>
                  <option value="updates">Updates</option>
                  <option value="tips">Tips & Tricks</option>
                </select>
                <TinyEditor
                  value={blogForm.content}
                  onChange={(content) => setBlogForm({ ...blogForm, content })}
                  height={300}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Blog Post'}
                </button>
              </form>
            </div>

            {/* Blogs List */}
            <h3 className="font-semibold mb-3">Blog Posts</h3>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{blog.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${blog.status === 'published' ? 'bg-green-100 text-green-800' :
                      blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {blog.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{blog.category}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      <FiEdit />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Feature Management</h2>

            {/* Create Feature Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Add New Feature</h3>
              <form onSubmit={createFeature}>
                <input
                  type="text"
                  placeholder="Feature Title"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <input
                  type="text"
                  placeholder="Icon (e.g., FiStar)"
                  value={featureForm.icon}
                  onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                />

                <textarea
                  placeholder="Feature Description"
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Add Feature'}
                </button>
              </form>
            </div>

            {/* Features List */}
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature._id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{feature.icon}</span>
                    <h4 className="font-semibold">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <div className="flex gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      <FiEdit />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">FAQ Management</h2>

            {/* Create FAQ Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Add New FAQ</h3>
              <form onSubmit={createFaq}>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                >
                  <option value="general">General</option>
                  <option value="account">Account</option>
                  <option value="billing">Billing</option>
                  <option value="technical">Technical</option>
                  <option value="features">Features</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Question"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <textarea
                  placeholder="Answer"
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Add FAQ'}
                </button>
              </form>
            </div>

            {/* FAQs List */}
            <h3 className="font-semibold mb-3">FAQs</h3>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{faq.question}</h4>
                    <span className={`px-2 py-1 rounded text-xs bg-gray-100 text-gray-800`}>
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                      <FiEdit />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{/* Pricing Tab */}
{activeTab === 'pricing' && (
  <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
    <h2 className="text-xl font-semibold mb-4">Pricing Management</h2>

    {/* Create/Edit Pricing Plan Form */}
    <div id="pricing-form" className="mb-6 p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">
        {isEditingPricing ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
      </h3>
      <form onSubmit={isEditingPricing ? updatePricingPlan : createPricingPlan}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Plan Name *</label>
          <input
            type="text"
            placeholder="e.g., Basic, Pro, Enterprise"
            value={pricingForm.name}
            onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Plan Description *</label>
          <textarea
            placeholder="Describe what this plan offers..."
            value={pricingForm.description}
            onChange={(e) => setPricingForm({ ...pricingForm, description: e.target.value })}
            rows={2}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={pricingForm.monthlyPrice}
              onChange={(e) => setPricingForm({ ...pricingForm, monthlyPrice: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Yearly Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={pricingForm.yearlyPrice}
              onChange={(e) => setPricingForm({ ...pricingForm, yearlyPrice: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        {isEditingPricing && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={pricingForm.isActive || false}
                  onChange={(e) => setPricingForm({ ...pricingForm, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={pricingForm.isPopular || false}
                  onChange={(e) => setPricingForm({ ...pricingForm, isPopular: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Popular</span>
              </label>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mb-3">
          💡 Tip: Yearly plans typically offer a discount (e.g., $9.99/month = $99.99/year)
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || isUpdatingPricing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting || isUpdatingPricing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditingPricing ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditingPricing ? 'Update Plan' : 'Create Plan'
            )}
          </button>
          
          {isEditingPricing && (
            <button
              type="button"
              onClick={cancelPricingEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

   {/* Pricing Plans List with Subscriber Counts */}
<h3 className="font-semibold mb-3">Existing Pricing Plans</h3>
{pricingPlansWithSubscribers.length === 0 ? (
  <div className="text-center py-8 text-gray-500">
    <FiDollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
    <p>No pricing plans created yet</p>
    <p className="text-sm mt-2">Click "Add New Pricing Plan" to get started</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {pricingPlansWithSubscribers.map((plan) => (
      <div key={plan._id} className={`border rounded-lg p-4 transition-all ${
        plan.isPopular ? 'ring-2 ring-yellow-400 shadow-lg' : ''
      } ${!plan.isActive ? 'opacity-60' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-lg">{plan.name}</h4>
          <div className="flex gap-1">
            {plan.isPopular && (
              <span className="text-yellow-500 text-xs">⭐ Popular</span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
        
        <div className="mb-2">
          <span className="text-2xl font-bold">${plan.price?.monthly || 0}</span>
          <span className="text-gray-600">/month</span>
        </div>
        
        <div className="mb-4">
          <span className="text-lg font-semibold">${plan.price?.yearly || 0}</span>
          <span className="text-gray-600">/year</span>
          {plan.price?.yearly > 0 && plan.price?.monthly > 0 && (
            <span className="text-green-600 text-sm ml-2">
              Save ${((plan.price.monthly * 12) - plan.price.yearly).toFixed(2)}/year
            </span>
          )}
        </div>

        {/* Subscriber Count */}
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Subscribers:</span>
            <span className="text-lg font-bold text-blue-600">
              {plan.subscriberCount || 0}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${stats?.totalUsers ? ((plan.subscriberCount || 0) / stats.totalUsers) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editPricingPlan(plan)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <FiEdit size={14} /> Edit
          </button>
          
          <button
            onClick={() => togglePricingActive(plan)}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
              plan.isActive 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {plan.isActive ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            {plan.isActive ? 'Deactivate' : 'Activate'}
          </button>
          
          <button
            onClick={() => togglePricingPopular(plan)}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
              plan.isPopular 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            <FiStar size={14} />
            {plan.isPopular ? 'Remove Popular' : 'Mark Popular'}
          </button>
          
          <button
            onClick={() => deletePricingPlan(plan._id, plan.name)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
          >
            <FiTrash2 size={14} /> Delete
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Status: {plan.isActive ? '✅ Active' : '❌ Inactive'} | 
          Order: {plan.order || 0}
        </div>
      </div>
    ))}
  </div>
)}

        {/* Guides Tab */}
        {activeTab === 'guides' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Guide Management</h2>

            {/* Create/Edit Guide Form */}
            <div id="guide-form" className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">
                {isEditing ? 'Edit Guide' : 'Create New Guide'}
              </h3>
              <form onSubmit={saveGuide}>
                <input
                  type="text"
                  placeholder="Guide Title"
                  value={guideForm.title}
                  onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
                  className="w-full p-2 border rounded mb-3"
                  required
                />

                {/* In the Guides Tab form - FIX THE SELECT ELEMENTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <select
                    value={guideForm.category}
                    onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    required
                  >
                    <option value="getting-started">Getting Started</option>
                    <option value="tutorials">Tutorials</option>
                    <option value="tips">Tips & Tricks</option>
                    <option value="troubleshooting">Troubleshooting</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <select
                    value={guideForm.difficulty}
                    onChange={(e) => setGuideForm({ ...guideForm, difficulty: e.target.value })}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <select
                    value={guideForm.status}
                    onChange={(e) => setGuideForm({ ...guideForm, status: e.target.value })}
                    className="w-full p-2 border rounded bg-white text-gray-800"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={guideForm.newTag}
                      onChange={(e) => setGuideForm({ ...guideForm, newTag: e.target.value })}
                      onKeyPress={handleTagKeyPress}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guideForm.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Guide Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Guide Description
                    </label>
                    <textarea
                      value={guideForm.description}
                      onChange={(e) =>
                        setGuideForm({ ...guideForm, description: e.target.value })
                      }
                      rows={2}
                      maxLength={300}
                      className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-white placeholder-gray-300 bg-gray-800"
                      placeholder="Write a short summary for your guide..."
                    />

                    <p className="mt-1 text-xs text-gray-300">
                      A short summary for your guide (appears in lists and previews).
                    </p>
                  </div>

                  {/* Guide Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Guide Content
                    </label>
                    <div className="rounded-lg shadow-sm border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                      <TinyEditor
                        value={guideForm.content}
                        onChange={(content) =>
                          setGuideForm({ ...guideForm, content })
                        }
                        height={400}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-300">
                      The full content of your guide. You can format text, add lists, and insert links or images.
                    </p>
                  </div>
                </div>


                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Guide' : 'Create Guide')}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Guides List */}
            <h3 className="font-semibold mb-3">Guides</h3>
            <div className="space-y-4">
              {guides.map((guide) => (
                <div key={guide._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{guide.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${guide.status === 'published' ? 'bg-green-100 text-green-800' :
                      guide.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {guide.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs bg-gray-100 text-gray-800`}>
                      {guide.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${guide.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      guide.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                      {guide.difficulty}
                    </span>
                    {guide.tags && guide.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-3">
                    {guide.excerpt || guide.description || 'No description'}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {guide.readTime} min read • {guide.views || 0} views
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editGuide(guide)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => updateGuideStatus(guide._id, guide.status === 'published' ? 'draft' : 'published')}
                        className={`px-3 py-1 rounded text-sm ${guide.status === 'published'
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                      >
                        {guide.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteGuide(guide._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emails Tab */}
        {activeTab === 'emails' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">Email Management</h2>

            {/* Bulk Email Form */}
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Send Bulk Email</h3>
              <input
                type="text"
                placeholder="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
               <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email Content
                    </label>
              
              <TinyEditor
                value={emailContent}
                onChange={setEmailContent}
                className="mt-5"
                height={200}
              />
              <button
                onClick={sendBulkEmail}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-5 rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send to All Users'}
              </button>
            </div>

              {/* Email History */}
    <h3 className="font-semibold mb-3">Email History</h3>
    <div className="space-y-3">
      {emails.map((email) => (
        <div key={email._id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold">{email.subject || 'No Subject'}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              email.status === 'completed' ? 'bg-green-100 text-green-800' :
              email.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              email.status === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {email.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
            <div>
              <span className="font-medium">Recipients: </span>
              {email.recipientCount || 0}
            </div>
            <div>
              <span className="font-medium">Sent: </span>
              {email.successfulSends || 0}
            </div>
            <div>
              <span className="font-medium">Failed: </span>
              {email.failedSends || 0}
            </div>
            <div>
              <span className="font-medium">Date: </span>
              {email.createdAt ? new Date(email.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">
            {(email.content || '').substring(0, 150)}...
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Sent by: {email.sentBy?.username || 'System'}</span>
            {email.completedAt && (
              <span>Completed: {new Date(email.completedAt).toLocaleString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Show message if no emails */}
    {emails.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        <FiMail className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No emails sent yet</p>
      </div>
    )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={`${currentTheme.cardBg} p-6 rounded-lg border`}>
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">General Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Enable user registration
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Require email verification
                  </label>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Email Settings</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="SMTP Host"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="SMTP Port"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Review Response Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Respond to Review</h3>
              <textarea
                value={reviewResponse}
                onChange={(e) => setReviewResponse(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded mb-4"
                placeholder="Type your response here..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReviewResponse}
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
