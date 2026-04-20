import unittest
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time
from playwright.sync_api import sync_playwright
import os

class TestLogin(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever)
        cls.server_thread.daemon = True
        cls.server_thread.start()
        time.sleep(1)

    def test_login_validation_empty(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto('http://localhost:8000/login.html')

            # Empty fields
            page.click('#submit')

            # Check for error messages
            username_group = page.locator('.form-group').first
            self.assertIn('error', username_group.get_attribute('class'))
            self.assertEqual(username_group.locator('small').inner_text(), 'Username is required!')

            password_group = page.locator('.form-group', has=page.locator('#password'))
            self.assertIn('error', password_group.get_attribute('class'))
            self.assertEqual(password_group.locator('small').inner_text(), 'Password is required!')

            browser.close()

    def test_login_validation_short(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto('http://localhost:8000/login.html')

            page.fill('#username', 'ab')
            page.fill('#password', '1234567')
            page.click('#submit')

            username_group = page.locator('.form-group').first
            self.assertIn('error', username_group.get_attribute('class'))
            self.assertEqual(username_group.locator('small').inner_text(), 'Username must be at least 3 characters long!')

            password_group = page.locator('.form-group').nth(1)
            self.assertIn('error', password_group.get_attribute('class'))
            self.assertEqual(password_group.locator('small').inner_text(), 'Password must be at least 8 characters long!')

            browser.close()

    def test_login_validation_success(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto('http://localhost:8000/login.html')

            page.fill('#username', 'damilary')
            page.fill('#password', 'password123')
            page.click('#submit')

            username_group = page.locator('.form-group').first
            self.assertIn('success', username_group.get_attribute('class'))

            password_group = page.locator('.form-group').nth(1)
            self.assertIn('success', password_group.get_attribute('class'))

            browser.close()

if __name__ == '__main__':
    unittest.main()
