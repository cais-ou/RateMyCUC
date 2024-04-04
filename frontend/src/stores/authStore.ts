import axiosInstance from '../plugins/axios/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    users: [],
  }),
  getters: {
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axiosInstance.post('api/auth/login', {
          withCredentials: true,
          email,
          password,
        })

        // Assuming the API responds with a token and user information
        if (response && response.data)
          this.user = response.data.passport.user
        await this.fetchUserProfile()
      }
      catch (err) {
        console.error(err)
        this.logout()
      }
    },
    // 在authStore中添加
    async checkAdminRole(role:string) {
      try {
        const response = await axiosInstance.post('http://localhost:5000/check-role', { role });
        return response.data.is_allowed;
      } catch (error) {
        console.error('Error checking role:', error);
        return false;
      }
    },
    async fetchUserProfile() {
      try {
        const response = await axiosInstance.get('/api/profile', {
          withCredentials: true,
        })

        if (response && response.data)
          this.user = response.data
      } catch (err) {
        console.error('获取用户信息失败:', err)
      }
    },
    async fetchAllUsers() {
      try{
        const response = await axiosInstance.get('/api/auth/users', {
          withCredentials:true,
        });
        if (response && response.data){
          this.users = response.data;
        }
      } catch (err) {
        console.error('获取所有用户信息失败:',err);
      }
    },
    async makeVisitor(userId:string) {
      try {
        await axiosInstance.patch(`http://localhost:5000/user/${userId}/make_visitor`);
      } catch (err) {
        console.error('设置用户角色为visitor失败:', err);
      }
    },
    
    async makeAuthenticator(userId:string) {
      try {
        await axiosInstance.patch(`http://localhost:5000/user/${userId}/make_authenticator`);
      } catch (err) {
        console.error('设置用户角色为authenticator失败:', err);
      }
    },
    
    async register(username: string, email: string, password: string) {
      try {
        const response = await axiosInstance.post('/api/auth/register', {
          withCredentials: true,
          username,
          email,
          password,
        })

        // Assuming the API responds with a token and user information
        if (response && response.data)
          this.user = response.data.passport.user
          await this.fetchUserProfile();
      }
      catch (err) {
        console.error(err)
        this.logout()
      }
    },
    logout() {
      this.user = null
    },
  },
})
