import { useUnit } from "effector-react";
import { Edit } from "lucide-react";

import { ResumeView } from "@/entities/resume";

import { Button } from "@/shared/ui/button";
import { PageLoader } from "@/shared/ui/page-loader.tsx";

import { $resume, editClicker } from "./model.ts";

export const JobseekerResumeViewPage = () => {
  const resume = useUnit($resume);
  const handleEditClick = useUnit(editClicker);

  if (!resume)
    return (
      <div className="h-156 flex justify-between items-center">
        <PageLoader />
      </div>
    );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мое резюме</h1>
        <div className="flex gap-2">
          {/*<Button variant="outline" size="sm">*/}
          {/*  <Download className="h-4 w-4 mr-2" />*/}
          {/*  Скачать PDF*/}
          {/*</Button>*/}
          {/*<Button variant="outline" size="sm">*/}
          {/*  <Share2 className="h-4 w-4 mr-2" />*/}
          {/*  Поделиться*/}
          {/*</Button>*/}
          <Button onClick={() => handleEditClick()} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>
      <ResumeView resume={resume} />
    </div>
  );
};
