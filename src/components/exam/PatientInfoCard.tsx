
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
    <div className="bg-clinicus-blue text-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">Case {caseNumber}: {patientInfo.name}</h2>
        <div className="flex flex-col gap-1 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 text-right">{i+1}.</span>
              <div className={`w-2 h-2 rounded-full ${i < caseNumber ? 'bg-clinicus-gold' : 'bg-white/30'}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {patientInfo.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden max-w-[200px] mx-auto">
            <img 
              src={patientInfo.imageUrl} 
              alt={patientInfo.name} 
              className="w-full object-cover"
            />
          </div>
        )}
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium">Case {caseNumber}</h3>
          <p className="text-white/80">Name: {patientInfo.name}</p>
          <p className="text-white/80">Pronouns: {patientInfo.pronouns}</p>
          <p className="text-white/80">Age: {patientInfo.age}</p>
        </div>

        {patientWords && (
          <div>
            <h3 className="font-medium mb-2 border-b border-white/10 pb-2">Patient's Words</h3>
            <p className="text-sm text-white/90 italic">"{patientWords}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInfoCard;
