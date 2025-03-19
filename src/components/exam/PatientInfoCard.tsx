
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
    <div className="bg-clinicus-blue rounded-lg overflow-hidden w-full shadow-md">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2 p-4 md:border-r border-white/10 flex flex-col justify-center">
          <h2 className="text-xl font-medium text-white">Case {caseNumber}: {patientInfo.name}</h2>
          <div className="flex flex-col gap-1 mt-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-right text-white">{i+1}.</span>
                <div className={`w-2 h-2 rounded-full ${i < caseNumber ? 'bg-clinicus-gold' : 'bg-white/30'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 p-4 md:border-r border-white/10 flex flex-col justify-center items-center">
          {patientInfo.imageUrl && (
            <div className="mb-3 rounded-lg overflow-hidden max-w-[140px]">
              <img 
                src={patientInfo.imageUrl} 
                alt={patientInfo.name} 
                className="w-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center">
            <p className="text-white font-medium text-lg">{patientInfo.name}</p>
            <p className="text-white/80 text-base">{patientInfo.pronouns} | Age: {patientInfo.age}</p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 p-4">
          {patientWords && (
            <div>
              <h3 className="font-medium mb-3 border-b border-white/10 pb-2 text-white text-lg">Patient's Words</h3>
              <p className="text-base text-white/90 italic leading-relaxed">"{patientWords}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
