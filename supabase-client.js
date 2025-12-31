// Supabase Client for Student Activity Management
class SupabaseClient {
    constructor() {
        this.client = null;
        this.studentId = null;
        this.isConnected = false;
    }

    /**
     * Initialize Supabase client with configuration
     * @param {Object} config - Supabase configuration {url, anonKey}
     * @param {string} studentId - Unique student identifier (optional, will generate if not provided)
     */
    async initialize(config, studentId = null) {
        try {
            if (typeof supabase === 'undefined') {
                throw new Error('Supabase library not loaded');
            }

            // Generate student ID if not provided
            if (!studentId) {
                studentId = this.generateStudentId();
            }

            this.client = supabase.createClient(config.url, config.anonKey || config.apiKey);
            this.studentId = studentId;

            // Test connection
            this.isConnected = await this.testConnection();
            
            // Register student if not exists
            if (this.isConnected) {
                await this.registerStudent();
            }

            console.log('✅ Connected to Supabase successfully');
            console.log('Student ID:', this.studentId);
            return this.isConnected;
        } catch (error) {
            console.error('Supabase initialization error:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Generate a unique student ID
     * @returns {string} Student ID
     */
    generateStudentId() {
        // Check if student ID exists in localStorage
        let studentId = localStorage.getItem('student_id');
        if (!studentId) {
            // Generate new ID
            studentId = 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('student_id', studentId);
        }
        return studentId;
    }

    /**
     * Test Supabase connectivity
     * @returns {Promise<boolean>} Connection status
     */
    async testConnection() {
        try {
            // Simple test - just check if we can query (tables might not exist yet)
            const { error } = await this.client
                .from('students')
                .select('count')
                .limit(1);

            if (error) {
                // If tables don't exist, that's okay - connection works
                if (error.code === '42P01' || error.message.includes('does not exist')) {
                    console.warn('⚠️ Supabase tables not created yet. Run SUPABASE_SCHEMA.sql');
                    console.warn('Activities will not be saved until tables are created.');
                    return true; // Connection works, just no tables
                }
                
                // Other errors (like 401) mean connection failed
                console.error('Connection test failed:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Connection test error:', error);
            return false;
        }
    }

    /**
     * Register student in database
     * @param {string} name - Student name (optional)
     * @param {string} email - Student email (optional)
     */
    async registerStudent(name = null, email = null) {
        try {
            // Check if student already exists
            const { data: existing } = await this.client
                .from('students')
                .select('id')
                .eq('student_id', this.studentId)
                .single();

            if (existing) {
                // Update last_active
                await this.client
                    .from('students')
                    .update({ last_active: new Date().toISOString() })
                    .eq('student_id', this.studentId);
                return;
            }

            // Insert new student
            const { error } = await this.client
                .from('students')
                .insert({
                    student_id: this.studentId,
                    name: name,
                    email: email
                });

            if (error) throw error;
        } catch (error) {
            console.error('Register student error:', error);
            // Non-critical error, don't throw
        }
    }

    /**
     * Save chat activity to Supabase
     * @param {string} request - User message
     * @param {string} response - AI response
     * @returns {Promise<Object>} Saved activity data
     */
    async saveActivity(request, response) {
        try {
            if (!this.isConnected) {
                console.warn('Not connected to Supabase, skipping activity save');
                return null;
            }

            const { data, error } = await this.client
                .from('activities')
                .insert({
                    student_id: this.studentId,
                    request: request,
                    response: response,
                    is_bookmarked: false
                })
                .select()
                .single();

            if (error) throw error;

            console.log('Activity saved to Supabase');
            return data;
        } catch (error) {
            console.error('Save activity error:', error);
            // Don't throw - allow app to continue even if save fails
            return null;
        }
    }

    /**
     * Get all activities for current student
     * @param {number} limit - Maximum number of activities to fetch
     * @returns {Promise<Array>} Array of activities
     */
    async getActivities(limit = 100) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Supabase');
            }

            const { data, error } = await this.client
                .from('activities')
                .select('*')
                .eq('student_id', this.studentId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Get activities error:', error);
            throw error;
        }
    }

    /**
     * Get only bookmarked activities
     * @returns {Promise<Array>} Array of bookmarked activities
     */
    async getBookmarkedActivities() {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Supabase');
            }

            const { data, error } = await this.client
                .from('activities')
                .select('*')
                .eq('student_id', this.studentId)
                .eq('is_bookmarked', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Get bookmarked activities error:', error);
            throw error;
        }
    }

    /**
     * Toggle bookmark status of an activity
     * @param {string} activityId - Activity UUID
     * @param {boolean} isBookmarked - New bookmark status
     * @returns {Promise<Object>} Updated activity
     */
    async toggleBookmark(activityId, isBookmarked) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Supabase');
            }

            const { data, error} = await this.client
                .from('activities')
                .update({ 
                    is_bookmarked: isBookmarked,
                    updated_at: new Date().toISOString()
                })
                .eq('id', activityId)
                .eq('student_id', this.studentId)
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Toggle bookmark error:', error);
            throw error;
        }
    }

    /**
     * Delete an activity
     * @param {string} activityId - Activity UUID
     * @returns {Promise<boolean>} Success status
     */
    async deleteActivity(activityId) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Supabase');
            }

            const { error } = await this.client
                .from('activities')
                .delete()
                .eq('id', activityId)
                .eq('student_id', this.studentId);

            if (error) throw error;

            return true;
        } catch (error) {
            console.error('Delete activity error:', error);
            throw error;
        }
    }

    /**
     * Get activity by ID
     * @param {string} activityId - Activity UUID
     * @returns {Promise<Object>} Activity data
     */
    async getActivity(activityId) {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to Supabase');
            }

            const { data, error } = await this.client
                .from('activities')
                .select('*')
                .eq('id', activityId)
                .eq('student_id', this.studentId)
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Get activity error:', error);
            throw error;
        }
    }

    /**
     * Check connection status
     * @returns {boolean} Connection status
     */
    isReady() {
        return this.isConnected && this.client !== null;
    }

    getConnectionStatus() {
        return this.isConnected;
    }

    /**
     * Disconnect from Supabase
     */
    disconnect() {
        this.client = null;
        this.studentId = null;
        this.isConnected = false;
    }
}

// Export singleton instance
const supabaseClient = new SupabaseClient();
window.supabaseClient = supabaseClient;
