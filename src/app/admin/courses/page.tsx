import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";

export default function CoursesPage(){
    return (<div className="container my-6">
        <PageHeader title="Courses">
        <Button asChild>
          <Link href="/admin/courses/new">New Course</Link>
        </Button>
      </PageHeader>

        <div>safasdf</div>
      {/* <CourseTable courses={courses} /> */}
        </div>)
}