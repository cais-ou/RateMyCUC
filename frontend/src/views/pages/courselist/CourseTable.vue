<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'
import { useCourseStore } from '@/stores/courseStore'

// Define component props
const props = defineProps({
  departmentName: {
    type: String,
    required: true,
  },
})

const authStore = useAuthStore();
const isLogged = computed (() => authStore.isLoggedIn);

// Define table headers
const headers = [
  { title: '课程名', key: 'coursename' },
  { title: '授课教师', key: 'teacher' },
  { title: '评分', key: 'rate' },
  { title: '评测数', key: 'numberofrating' },
]

// Search text
const searchText = ''

// Loading state
const loading = ref(true)

// Use the course store
const courseStore = useCourseStore()

// Card details visibility
const isCardDetailsVisible = ref(false)

// Fetch course list by department name
const fetchCourseList = async () => {
  loading.value = true
  await courseStore.fetchCourseListByDepartment(props.departmentName)
  loading.value = false
}

// Toggle card details visibility
const toggleCardDetails = () => {
  isCardDetailsVisible.value = !isCardDetailsVisible.value
  if(!isLogged.value){
    router.push('/login');
  }
  if (isCardDetailsVisible.value)
    fetchCourseList().then(() => {})
}

const itemsPerPageText = '每页课程数：'

// Filtered course items
const filteredItems = computed(() => {
  if (searchText) {
    const searchTerm = searchText.toLowerCase()

    return courseStore.courseMap[props.departmentName].filter(
      item => item.coursename.toLowerCase().includes(searchTerm) || item.teacher.toLowerCase().includes(searchTerm),
    )
  }
  else {
    return courseStore.courseMap[props.departmentName]
  }
})

// Handle search
// Handle search
const handleSearch = () => {
  loading.value = true
  loading.value = false
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle>
            {{ departmentName }}
          </VCardTitle>
        </VCardItem>
        <VCardActions>
          <!-- Toggle card details button -->
          <VBtn @click="toggleCardDetails">
            Details
          </VBtn>

          <VSpacer />

          <!-- Card details visibility toggle button -->
          <VBtn
            icon
            size="small"
            @click="toggleCardDetails"
          >
            <VIcon :icon="isCardDetailsVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          </VBtn>
        </VCardActions>

        <!-- Card details content -->
        <VExpandTransition>
          <div v-show="isCardDetailsVisible">
            <VDivider />
            <div class="table-wrapper">
              <VSkeletonLoader
                v-if="loading"
                class="loader-overlay"
              >
                <div id="loading-bg" />
                <div class="loading-logo">
                  <div class="loading">
                    <div class="effect-1" />
                    <div class="effect-2" />
                    <div class="effect-3" />
                  </div>
                </div>
              </VSkeletonLoader>
              <VTable v-if="!loading">
                <tbody>
                  <tr>
                    <!-- Data table -->
                    <td>
                      <VTextField
                        v-model="searchText"
                        variant="solo"
                        label="输入搜索 课程/老师名"
                        prepend-inner-icon="mdi-magnify"
                        single-line
                        hide-details
                        @input="handleSearch"
                      />
                      <VDataTable
                        id="sort-header"
                        :search="searchText"
                        :headers="headers"
                        :items="filteredItems"
                        :items-per-page="10"
                        class="elevation-1"
                      >
                        <!-- Custom button content for Action column -->
                        <template #item.coursename="{ item }">
                          <div>
                            <RouterLink :to="`/review/${item.value.classID}`">
                              {{ item.value.coursename }}
                            </RouterLink>
                          </div>
                        </template>
                      </VDataTable>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </div>
        </VExpandTransition>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
/* Add the loading styles here */
@import '../../../../public/loader.css';
.table-wrapper {
  position: relative;
  min-height: 300px; /* Set a minimum height to ensure the wrapper is visible even if the table is empty */
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-name {
  cursor: pointer;
  color: #9155fd;
}

#sort-header {
  .v-data-table-header__content {
    justify-content: inherit;
  }
}
</style>
