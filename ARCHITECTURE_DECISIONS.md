# 🧠 EMT Triage Training App – Architecture Decisions

This document explains key architectural choices made during development of the EMT Triage Training App, including design tradeoffs, technology selection, and structural decisions.

---

## 🧱 Project Structure

- **Frontend**: Built with React Native + Expo for cross-platform mobile support
- **Backend**: Firebase Functions (Gen 2) for serverless AI orchestration and data handling
- **Database**: Cloud Firestore for real-time, scalable storage
- **AI Integration**: Hugging Face and OpenAI models for scenario generation and review feedback

---

## ❌ Why We Skipped Traditional Controllers

We did **not** implement traditional MVC-style controllers because:

- The app uses **Firebase Functions**, which act as isolated endpoints — each function already behaves like a controller.
- The frontend is built in **React Native**, which organizes logic into screens and components, not controllers.
- We prioritized **modularity and speed** over boilerplate — adding controllers would increase complexity without clear benefit.
- Our architecture favors **function-based orchestration** over route-based control.

Instead, we use:
- **Screen components** for UI logic
- **Service modules** for AI and Firestore interactions
- **Firebase Functions** for backend logic

---

## ✅ Why We Chose Firebase

- **Serverless**: No need to manage infrastructure
- **Realtime Database**: Firestore supports live updates and scalable reads/writes
- **Authentication**: Built-in user management with role-based access
- **Security Rules**: Fine-grained control over data access
- **Easy AI Integration**: Functions can call external APIs like Hugging Face and OpenAI

---

## 🤖 Why We Chose Hugging Face & OpenAI

- **OpenAI GPT-4**: Reliable fallback review generation and complex assessments
- **Mistral (via Hugging Face)**: Fast, cost-effective review generation
- **BioBERT**: Planned for medical entity recognition
- **DialoGPT**: Planned for conversational coaching
- **Sentence Transformers**: Planned for semantic similarity scoring

We use **multiple models** to balance cost, speed, and accuracy.

---

## 🧠 Why We Use Firestore for AI Caching

- Reduces API calls and cost
- Enables offline access to previously generated content
- Supports real-time updates and instructor dashboards

---

## 🔐 Why We Use Role-Based Routing

- Students and instructors have different access needs
- Firestore rules enforce secure data boundaries
- Roles persist across sessions via Firebase Auth

---

## 🧪 Why We Prioritize Fallback Logic

- AI services may fail due to rate limits or outages
- Fallback reviews ensure uninterrupted training
- Improves reliability and user trust

---

## 📦 Why We Modularize by Feature

- Easier to maintain and test
- Each screen handles its own logic and data flow
- Shared utilities for AI, Firestore, and navigation

---

## 🧭 Future Considerations

- May introduce controller-style abstraction if backend expands
- May migrate to Express or NestJS if multi-endpoint API is needed
- May add Redux or Zustand for global state if app complexity grows

---

**Last Updated**: November 2025  
**Author**: M – Backend Lead  
