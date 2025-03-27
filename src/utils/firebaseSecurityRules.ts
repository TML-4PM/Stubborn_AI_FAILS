
/**
 * Firebase Security Rules for Firestore and Storage
 * 
 * These rules should be manually applied in the Firebase Console:
 * 1. For Firestore: Firebase Console > Firestore Database > Rules
 * 2. For Storage: Firebase Console > Storage > Rules
 */

/**
 * Firestore security rules
 * Allows read access to all users for approved submissions
 * Allows write access for authenticated users to create their own submissions
 */
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Submissions collection rules
    match /submissions/{submissionId} {
      // Anyone can read approved submissions
      allow read: if resource.data.status == 'approved';
      
      // Authenticated users can read their own pending/rejected submissions
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      
      // Anyone can create a submission (even anonymous users)
      allow create: if true;
      
      // Owners can update their own submissions
      allow update: if request.auth != null && resource.data.user_id == request.auth.uid;
      
      // Only admins can approve/reject submissions (implement admin check later)
      // allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection rules (for future use)
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;

/**
 * Storage security rules
 * Allows anyone to upload images to the fails directory
 * Restricts file types and sizes
 */
export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files in the 'fails' directory
    match /fails/{fileName} {
      allow read: if true;
      
      // Allow anyone to upload images (5MB max size, must be an image)
      allow create: if request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
      
      // Allow users to delete their own uploads (implement later)
      // allow delete: if request.auth != null && ... ;
    }
  }
}
`;

/**
 * Instructions for updating Firebase security rules
 */
export const firebaseSecurityInstructions = `
To update Firebase security rules:

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project: "ai-oopsies"
3. Update Firestore Rules:
   - Navigate to Firestore Database > Rules
   - Copy and paste the Firestore rules
   - Click "Publish"

4. Update Storage Rules:
   - Navigate to Storage > Rules
   - Copy and paste the Storage rules
   - Click "Publish"

These rules allow:
- Anyone to view approved submissions
- Anyone to create submissions (even anonymously)
- Users to view and update their own submissions
- Anyone to upload images up to 5MB in size
`;
