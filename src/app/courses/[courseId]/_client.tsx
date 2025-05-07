"use client"

import { SkeletonArray, SkeletonText } from "@/components/Skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2Icon, VideoIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export function CoursePageClient({
  course,
}: {
  course: {
    id: string
    courseSections: {
      id: string
      name: string
      lessons: {
        id: string
        name: string
        isComplete: boolean
      }[]
    }[]
  }
}) {
  const { lessonId } = useParams()
  //console.log(lessonId)
  const defaultValue =
    typeof lessonId === "string"
      ? course.courseSections.find(section =>
          section.lessons.find(lesson => lesson.id === lessonId)
        )
      : course.courseSections[0]

  return (
    <Accordion
      type="multiple"
      defaultValue={defaultValue ? [defaultValue.id] : undefined}
    >
      {course.courseSections.map(section => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-lg">
            {section.name}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            {section.lessons.map(lesson => (
              <Button
                variant="ghost"
                asChild
                key={lesson.id}
                className={cn(
                  "justify-start",
                  lesson.id === lessonId &&
                    "bg-accent/75 text-accent-foreground"
                )}
              >
                <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                  <VideoIcon />
                  {lesson.name}
                  {lesson.isComplete && (
                    <CheckCircle2Icon className="ml-auto" />
                  )}
                </Link>
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}



export function CoursePageSkeleton({amount}: {amount: number}){
  return (
    <>
   <SkeletonText className="w-36" size="lg" />
    <Accordion
      type="multiple"
      defaultValue = {['value-0']}
    >
      {Array(amount).fill(null).map((_,index) => (
        <AccordionItem key={index} value={`value-${index}`}>
          <AccordionTrigger className="text-lg">
            <SkeletonText className="w-36" size="lg" />
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <SkeletonArray amount={1}>
              <SkeletonText rows={5} className="w-36" />
            </SkeletonArray>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    </>
  )
}