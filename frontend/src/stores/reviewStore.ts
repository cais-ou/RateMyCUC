import { defineStore } from 'pinia'
import axiosInstance from '../plugins/axios/axios'

interface Review {
  id: number
  difficulty: string
  gain: string
  score: string
  rate: string
  publishTime: string
  updateTime: string
  content: string
  upvoteCount: number
  downvoteCount: number
  numberOfComments: number
}

interface CourseTag {
  courseId: number
  tagId: number
  upvotes: number
  tag: Tag
}
interface Tag {
  id: number
  name: string
  totalUpvotes: number
}

interface Teacher {
  id: number
  teacherName: string
  courses: SimplifyCourse[]
}

interface SimplifyCourse {
  classID: number
  courseName: string
  tags: []
}
export interface Course {
  classID: number
  courseNumber: string
  courseName: string
  limitDesc: string
  departmentName: string
  courseTypeName: string
  teacherName: string
  credit: string
  hours: number
  totalDifficulty: number
  totalGain: number
  totalRate: number
  totalScore: number
  numberOfRatings: number
  reviews: Review[]
  courseTags: CourseTag[]
  teachers: Teacher[]
}

export const useReviewStore = defineStore({
  id: 'review',
  state: (): { course: Course | null } => ({
    course: null,
  }),
  getters: {
    averageDifficulty(state) {
      return (state.course?.totalDifficulty ?? 0) / (state.course?.numberOfRatings ?? 1)
    },
    averageGain(state) {
      return (state.course?.totalGain ?? 0) / (state.course?.numberOfRatings ?? 1)
    },
    averageRate(state) {
      const average = (state.course?.totalRate ?? 0) / (state.course?.numberOfRatings ?? 1)

      return isNaN(average) ? 0 : average.toFixed(1)
    },
    averageScore(state) {
      return (state.course?.totalScore ?? 0) / (state.course?.numberOfRatings ?? 1)
    },
  },
  actions: {
    async fetchCourse(id: number) {
      const response = await axiosInstance.get(`/api/courses/${id}`)

      this.course = await response.data
    },
    async deleteReview(id:number){
      try{
        await axiosInstance.delete(`/api/reviews/${id}`);
      // 从当前课程评论列表中移除被删除的评论
      if (this.course && this.course.reviews) {
        this.course.reviews = this.course.reviews.filter(review => review.id !== id);
      }
    }catch(error){
      console.error(`Failed to delete review with ID ${id}:`, error);
      throw error; 
    }
  },
    async upvoteTag(courseId: number, tagId: number) {
      await axiosInstance.post(`/api/courses/${courseId}/tags/${tagId}/upvote`)
      await this.fetchCourse(courseId)
    },
    async addTag(courseId: number, tagName: string) {
      await axiosInstance.post(`/api/courses/${courseId}/tags`, { tagName })
      await this.fetchCourse(courseId)
    },
    async submitReview(courseId: number, authorId: number, difficulty: number, gain: number, rate: number, score: number, content: string, title: string) {
      await axiosInstance.post('/api/reviews', {
        courseId,
        authorId,
        difficulty,
        gain,
        rate,
        score,
        content,
        title,
      })
      await this.fetchCourse(courseId)
    },
  },
})
