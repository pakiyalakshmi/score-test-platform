
import React from 'react';

interface PatientInfoCardProps {
  patientInfo: {
    name: string;
    pronouns: string;
    age: number;
    imageUrl?: string;
  };
  caseNumber: number;
  patientWords?: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientInfo,
  caseNumber,
  patientWords
}) => {
  return (
    <div className="bg-clinicus-blue rounded-lg overflow-hidden w-full">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 p-4 border-r border-white/10 flex flex-col justify-center">
          <h2 className="text-lg font-medium text-white">Case {caseNumber}: {patientInfo.name}</h2>
          <div className="flex flex-col gap-1 mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-right text-white">{i+1}.</span>
                <div className={`w-2 h-2 rounded-full ${i < caseNumber ? 'bg-clinicus-gold' : 'bg-white/30'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 p-4 border-r border-white/10 flex flex-col justify-center items-center">
          {patientInfo.imageUrl && (
            <div className="mb-2 rounded-lg overflow-hidden max-w-[120px]">
              <img 
                src={patientInfo.imageUrl} 
                alt={patientInfo.name} 
                className="w-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center">
            <p className="text-white font-medium">{patientInfo.name}</p>
            <p className="text-white/80 text-sm">{patientInfo.pronouns} | Age: {patientInfo.age}</p>
          </div>
        </div>

        <div className="col-span-7 p-4">
          {patientWords && (
            <div>
              <h3 className="font-medium mb-2 border-b border-white/10 pb-2 text-white">Patient's Words</h3>
              <p className="text-sm text-white/90 italic">"{patientWords}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
