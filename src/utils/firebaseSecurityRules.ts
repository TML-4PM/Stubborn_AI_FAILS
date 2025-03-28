/**
 * Firebase Security Rules for Storage
 * 
 * These rules should be manually applied in the Firebase Console:
 * Firebase Console > Storage > Rules
 */

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
To update Firebase Storage rules:

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project: "ai-oopsies"
3. Update Storage Rules:
   - Navigate to Storage > Rules
   - Copy and paste the Storage rules
   - Click "Publish"

These rules allow:
- Anyone to view uploaded images
- Anyone to upload images up to 5MB in size
`;
