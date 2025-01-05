import { Upload } from 'lucide-react';
function UploadSection({resumeFile, setResumeFile}) {
    return (
        <div className="border border-2 border-dashed rounded-3 p-4 text-center">
                <label className="d-block cursor-pointer">
                  <Upload className="mb-2" size={32} />
                  <p className="text-muted mb-0">
                    {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                  </p>
                  <input
                    type="file"
                    className="d-none"
                    accept=".pdf"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setResumeFile(file);
                        }
                    }}
                  />
                </label>
              </div>
    )

}
export default UploadSection;