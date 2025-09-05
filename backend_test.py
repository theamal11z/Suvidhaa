#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Suvidhaa Civic Platform
Tests all backend APIs including NVIDIA AI integration, Cloudinary uploads, and MongoDB operations
"""

import requests
import json
import io
import base64
from datetime import datetime
import time
import os
from pathlib import Path

# Configuration
BASE_URL = "https://suvidhaa-bridge.preview.emergentagent.com/api"
TEST_USER_EMAIL = "priya.sharma@example.com"
TEST_USER_NAME = "Priya Sharma"
TEST_USER_PHONE = "+977-9841234567"

class SuvidhaaAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_root_endpoint(self):
        """Test root API health check"""
        try:
            response = self.session.get(f"{BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "Suvidhaa" in data.get("message", ""):
                    self.log_result("Root API Health Check", True, "API is responding correctly")
                    return True
                else:
                    self.log_result("Root API Health Check", False, "Unexpected response message", data)
            else:
                self.log_result("Root API Health Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Root API Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/dashboard/stats")
            if response.status_code == 200:
                data = response.json()
                expected_keys = ['total_documents', 'documents_this_month', 'total_questions', 
                               'answered_questions', 'total_suggestions', 'total_grievances', 'resolved_grievances']
                
                missing_keys = [key for key in expected_keys if key not in data]
                if not missing_keys:
                    self.log_result("Dashboard Statistics", True, "All statistics available", data)
                    return True
                else:
                    self.log_result("Dashboard Statistics", False, f"Missing keys: {missing_keys}", data)
            else:
                self.log_result("Dashboard Statistics", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Dashboard Statistics", False, f"Error: {str(e)}")
        return False
    
    def create_test_pdf_content(self):
        """Create a simple PDF-like content for testing"""
        # Create a simple text file that mimics PDF content
        content = """
        नेपाल सरकार
        स्थानीय तह विकास मन्त्रालय
        
        सूचना नम्बर: २०८१/०२/१५
        
        विषय: नागरिक सेवा सुधार कार्यक्रम
        
        यस मन्त्रालयले नागरिक सेवामा सुधार ल्याउने उद्देश्यले निम्न कार्यक्रमहरू सञ्चालन गर्ने निर्णय गरेको छ:
        
        १. डिजिटल सेवा प्रणाली विस्तार
        २. नागरिक उजुरी व्यवस्थापन सुधार
        ३. पारदर्शिता बृद्धि कार्यक्रम
        
        यी कार्यक्रमहरू २०८१ चैत्र १ देखि लागू हुनेछ।
        
        सम्पर्क: स्थानीय तह विकास मन्त्रालय, सिंहदरबार
        """
        return content.encode('utf-8')
    
    def test_document_upload(self):
        """Test document upload with AI processing"""
        try:
            # Create test document content
            test_content = self.create_test_pdf_content()
            
            # Prepare multipart form data
            files = {
                'file': ('test_document.txt', io.BytesIO(test_content), 'text/plain')
            }
            data = {
                'title': 'नागरिक सेवा सुधार कार्यक्रम',
                'document_type': 'policy'
            }
            
            # Remove JSON content-type for multipart
            headers = {'Accept': 'application/json'}
            
            response = requests.post(f"{BASE_URL}/documents/upload", files=files, data=data, headers=headers)
            
            if response.status_code == 200:
                doc_data = response.json()
                required_fields = ['id', 'title', 'original_content', 'summary_english', 'key_points']
                
                missing_fields = [field for field in required_fields if field not in doc_data]
                if not missing_fields:
                    # Check if AI processing worked
                    if doc_data.get('summary_english') and doc_data.get('key_points'):
                        self.log_result("Document Upload & AI Processing", True, 
                                      f"Document uploaded and processed. AI summary: {doc_data['summary_english'][:100]}...")
                        return doc_data['id']
                    else:
                        self.log_result("Document Upload & AI Processing", False, 
                                      "Document uploaded but AI processing failed", doc_data)
                else:
                    self.log_result("Document Upload & AI Processing", False, 
                                  f"Missing fields: {missing_fields}", doc_data)
            else:
                self.log_result("Document Upload & AI Processing", False, 
                              f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Document Upload & AI Processing", False, f"Error: {str(e)}")
        return None
    
    def test_document_retrieval(self):
        """Test document retrieval"""
        try:
            response = self.session.get(f"{BASE_URL}/documents")
            if response.status_code == 200:
                documents = response.json()
                if isinstance(documents, list):
                    self.log_result("Document Retrieval", True, f"Retrieved {len(documents)} documents")
                    return True
                else:
                    self.log_result("Document Retrieval", False, "Response is not a list", documents)
            else:
                self.log_result("Document Retrieval", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Document Retrieval", False, f"Error: {str(e)}")
        return False
    
    def test_question_submission(self):
        """Test question submission with evidence"""
        try:
            # Create test evidence file
            evidence_content = "यो प्रमाण फाइल हो जसमा सम्बन्धित जानकारी छ।".encode('utf-8')
            
            files = {
                'evidence_files': ('evidence.txt', io.BytesIO(evidence_content), 'text/plain')
            }
            
            question_data = {
                'user_name': TEST_USER_NAME,
                'email': TEST_USER_EMAIL,
                'phone': TEST_USER_PHONE,
                'question_text': 'नागरिक सेवा सुधार कार्यक्रमको बारेमा थप जानकारी कहाँ पाउन सकिन्छ?',
                'category': 'सूचना अधिकार',
                'government_office': 'स्थानीय तह विकास मन्त्रालय'
            }
            
            headers = {'Accept': 'application/json'}
            
            response = requests.post(f"{BASE_URL}/questions", files=files, data=question_data, headers=headers)
            
            if response.status_code == 200:
                question = response.json()
                if question.get('id') and question.get('question_text'):
                    self.log_result("Question Submission", True, 
                                  f"Question submitted successfully. ID: {question['id']}")
                    return question['id']
                else:
                    self.log_result("Question Submission", False, "Invalid response format", question)
            else:
                self.log_result("Question Submission", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Question Submission", False, f"Error: {str(e)}")
        return None
    
    def test_suggestion_submission(self):
        """Test suggestion submission"""
        try:
            suggestion_data = {
                'user_name': TEST_USER_NAME,
                'email': TEST_USER_EMAIL,
                'suggestion_text': 'डिजिटल सेवामा मोबाइल एप्लिकेसन थप्नुपर्छ जसले नागरिकहरूलाई सजिलो पहुँच प्रदान गर्छ।',
                'category': 'डिजिटल सेवा',
                'related_document_id': None
            }
            
            response = self.session.post(f"{BASE_URL}/suggestions", json=suggestion_data)
            
            if response.status_code == 200:
                suggestion = response.json()
                if suggestion.get('id') and suggestion.get('suggestion_text'):
                    self.log_result("Suggestion Submission", True, 
                                  f"Suggestion submitted successfully. ID: {suggestion['id']}")
                    return suggestion['id']
                else:
                    self.log_result("Suggestion Submission", False, "Invalid response format", suggestion)
            else:
                self.log_result("Suggestion Submission", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Suggestion Submission", False, f"Error: {str(e)}")
        return None
    
    def test_cosign_suggestion(self, suggestion_id):
        """Test co-signature functionality"""
        if not suggestion_id:
            self.log_result("Co-signature Test", False, "No suggestion ID provided")
            return False
            
        try:
            cosign_data = {
                'signer_name': 'राम बहादुर श्रेष्ठ',
                'signer_email': 'ram.shrestha@example.com'
            }
            
            headers = {'Accept': 'application/json'}
            
            response = requests.post(f"{BASE_URL}/suggestions/{suggestion_id}/cosign", 
                                   data=cosign_data, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if "successfully" in result.get('message', '').lower():
                    self.log_result("Co-signature Test", True, "Co-signature added successfully")
                    return True
                else:
                    self.log_result("Co-signature Test", False, "Unexpected response", result)
            else:
                self.log_result("Co-signature Test", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Co-signature Test", False, f"Error: {str(e)}")
        return False
    
    def test_grievance_filing(self):
        """Test grievance filing with evidence"""
        try:
            # Create test evidence
            evidence_content = "यो उजुरीको प्रमाण फाइल हो।".encode('utf-8')
            
            files = {
                'evidence_files': ('grievance_evidence.txt', io.BytesIO(evidence_content), 'text/plain')
            }
            
            grievance_data = {
                'user_name': TEST_USER_NAME,
                'email': TEST_USER_EMAIL,
                'phone': TEST_USER_PHONE,
                'grievance_text': 'स्थानीय कार्यालयमा सेवा प्राप्त गर्न धेरै समय लाग्छ र कर्मचारीहरूको व्यवहार राम्रो छैन।',
                'category': 'सेवा गुणस्तर',
                'affected_area': 'काठमाडौं महानगरपालिका',
                'government_office': 'काठमाडौं महानगरपालिका'
            }
            
            headers = {'Accept': 'application/json'}
            
            response = requests.post(f"{BASE_URL}/grievances", files=files, data=grievance_data, headers=headers)
            
            if response.status_code == 200:
                grievance = response.json()
                if grievance.get('id') and grievance.get('grievance_text'):
                    self.log_result("Grievance Filing", True, 
                                  f"Grievance filed successfully. ID: {grievance['id']}")
                    return grievance['id']
                else:
                    self.log_result("Grievance Filing", False, "Invalid response format", grievance)
            else:
                self.log_result("Grievance Filing", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Grievance Filing", False, f"Error: {str(e)}")
        return None
    
    def test_watchlist_creation(self):
        """Test watchlist creation"""
        try:
            watchlist_data = {
                'user_email': TEST_USER_EMAIL,
                'name': 'डिजिटल सेवा अपडेट',
                'keywords': ['डिजिटल', 'सेवा', 'अनलाइन'],
                'categories': ['डिजिटल सेवा', 'सूचना प्रविधि'],
                'government_offices': ['स्थानीय तह विकास मन्त्रालय'],
                'notification_frequency': 'weekly'
            }
            
            response = self.session.post(f"{BASE_URL}/watchlists", json=watchlist_data)
            
            if response.status_code == 200:
                watchlist = response.json()
                if watchlist.get('id') and watchlist.get('name'):
                    self.log_result("Watchlist Creation", True, 
                                  f"Watchlist created successfully. ID: {watchlist['id']}")
                    return watchlist['id']
                else:
                    self.log_result("Watchlist Creation", False, "Invalid response format", watchlist)
            else:
                self.log_result("Watchlist Creation", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Watchlist Creation", False, f"Error: {str(e)}")
        return None
    
    def test_watchlist_retrieval(self):
        """Test watchlist retrieval"""
        try:
            params = {'user_email': TEST_USER_EMAIL}
            response = self.session.get(f"{BASE_URL}/watchlists", params=params)
            
            if response.status_code == 200:
                watchlists = response.json()
                if isinstance(watchlists, list):
                    self.log_result("Watchlist Retrieval", True, 
                                  f"Retrieved {len(watchlists)} watchlists for user")
                    return True
                else:
                    self.log_result("Watchlist Retrieval", False, "Response is not a list", watchlists)
            else:
                self.log_result("Watchlist Retrieval", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Watchlist Retrieval", False, f"Error: {str(e)}")
        return False
    
    def test_user_submissions(self):
        """Test user submissions retrieval"""
        try:
            params = {'user_email': TEST_USER_EMAIL}
            response = self.session.get(f"{BASE_URL}/submissions", params=params)
            
            if response.status_code == 200:
                submissions = response.json()
                expected_keys = ['questions', 'suggestions', 'grievances']
                
                missing_keys = [key for key in expected_keys if key not in submissions]
                if not missing_keys:
                    total_submissions = (len(submissions.get('questions', [])) + 
                                       len(submissions.get('suggestions', [])) + 
                                       len(submissions.get('grievances', [])))
                    self.log_result("User Submissions Retrieval", True, 
                                  f"Retrieved {total_submissions} total submissions")
                    return True
                else:
                    self.log_result("User Submissions Retrieval", False, 
                                  f"Missing keys: {missing_keys}", submissions)
            else:
                self.log_result("User Submissions Retrieval", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Submissions Retrieval", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Suvidhaa Backend API Tests")
        print(f"📍 Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Cannot connect to API. Stopping tests.")
            return False
        
        # Test dashboard
        self.test_dashboard_stats()
        
        # Test document processing
        document_id = self.test_document_upload()
        self.test_document_retrieval()
        
        # Test question submission
        question_id = self.test_question_submission()
        
        # Test suggestion system
        suggestion_id = self.test_suggestion_submission()
        if suggestion_id:
            self.test_cosign_suggestion(suggestion_id)
        
        # Test grievance system
        grievance_id = self.test_grievance_filing()
        
        # Test watchlist system
        watchlist_id = self.test_watchlist_creation()
        self.test_watchlist_retrieval()
        
        # Test user submissions
        self.test_user_submissions()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the details above.")
            
        return passed == total

def main():
    """Main test execution"""
    tester = SuvidhaaAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w', encoding='utf-8') as f:
        json.dump(tester.test_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)