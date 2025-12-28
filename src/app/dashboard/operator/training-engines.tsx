import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, PenTool, ArrowRight, RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function QuizEngine({ questions, onComplete }: { questions: any[], onComplete: () => void }) {
    const [currentQIndex, setCurrentQIndex] = React.useState(0)
    const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [score, setScore] = React.useState(0)
    const [showResults, setShowResults] = React.useState(false)

    const question = questions[currentQIndex]

    const handleSubmit = () => {
        setIsSubmitted(true)
        if (selectedOption === question.correct) {
            setScore(score + 1)
        }
    }

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1)
            setSelectedOption(null)
            setIsSubmitted(false)
        } else {
            setShowResults(true)
            if (onComplete) onComplete()
        }
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100)
        const passed = percentage >= 80
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white">
                <div className={`p-4 rounded-full ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {passed ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{percentage}% Score</h2>
                    <p className="text-gray-500 mt-2">{passed ? 'Great job! You have passed this module.' : 'You did not meet the passing score (80%). Please review and try again.'}</p>
                </div>
                <div className="flex gap-4">
                    {!passed && <Button onClick={() => { setShowResults(false); setCurrentQIndex(0); setScore(0); setIsSubmitted(false); setSelectedOption(null) }} variant="outline"><RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz</Button>}
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-white p-8 flex flex-col">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
                <span>Question {currentQIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="flex-1 max-w-2xl mx-auto w-full space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">{question.q}</h3>

                <div className="space-y-3">
                    {question.options.map((opt: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => !isSubmitted && setSelectedOption(i)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                                ${isSubmitted && i === question.correct ? 'border-green-500 bg-green-50 text-green-700' :
                                    isSubmitted && selectedOption === i && i !== question.correct ? 'border-red-500 bg-red-50 text-red-700' :
                                        selectedOption === i ? 'border-blue-500 bg-[#0A3225]/5' : 'border-gray-200 hover:border-[#0A3225]/20'
                                }`}
                            disabled={isSubmitted}
                        >
                            <span className="font-medium">{opt}</span>
                            {isSubmitted && i === question.correct && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {isSubmitted && selectedOption === i && i !== question.correct && <XCircle className="w-5 h-5 text-red-600" />}
                        </button>
                    ))}
                </div>

                {isSubmitted && (
                    <div className="p-4 bg-[#0A3225]/5 text-[#0A3225] rounded-lg text-sm">
                        <strong>Explanation:</strong> {question.feedback || (selectedOption === question.correct ? "Correct! Well done." : "Incorrect. Review the material.")}
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-end">
                {!isSubmitted ? (
                    <Button size="lg" onClick={handleSubmit} disabled={selectedOption === null}>Submit Answer</Button>
                ) : (
                    <Button size="lg" onClick={handleNext}>
                        {currentQIndex < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export function SimulatorEngine() {
    const [simSpeed, setSimSpeed] = React.useState(50)
    const [simFlow, setSimFlow] = React.useState(10)
    const [targetAchieved, setTargetAchieved] = React.useState(false)

    React.useEffect(() => {
        const optimal = 62
        const deviation = Math.abs(simSpeed - optimal)
        const flow = Math.max(0, 100 - (deviation * 2))
        setSimFlow(flow)
        if (flow > 90) setTargetAchieved(true)
        else setTargetAchieved(false)
    }, [simSpeed])

    return (
        <div className="h-full bg-slate-950 text-white flex flex-col md:flex-row p-6 gap-8">
            <div className="flex-1 flex flex-col justify-center space-y-8">
                <div>
                    <Badge variant="outline" className="mb-2 text-blue-400 border-blue-400">Interactive Lab</Badge>
                    <h2 className="text-2xl font-bold">Doser Calibration</h2>
                    <p className="text-slate-400 mt-2">Adjust the motor speed to achieve the target flow rate (90%+). Watch the flow visualization update in real-time.</p>
                </div>

                <div className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-300">Motor Speed (RPM)</span>
                        <span className="font-mono text-blue-400">{simSpeed}%</span>
                    </div>
                    <Slider value={[simSpeed]} onValueChange={(v) => setSimSpeed(v[0])} max={100} step={1} className="py-2" />

                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <span className="text-sm text-slate-400">Target Status</span>
                        {targetAchieved ?
                            <Badge className="bg-green-500 text-white hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Optimal Flow</Badge> :
                            <Badge variant="destructive">Calibration Needed</Badge>
                        }
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/3 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-end justify-center p-8">
                <div className="absolute top-4 right-4 font-mono text-xl text-slate-500">
                    {simFlow.toFixed(1)} g/min
                </div>
                {/* Flow Visualization */}
                <div className="w-24 bg-slate-800 rounded-b-xl relative overflow-hidden h-[300px] border border-slate-700">
                    <motion.div
                        animate={{ height: `${simFlow}%` }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400"
                    />
                    <div className="absolute top-0 left-0 right-0 h-4 bg-slate-600/50 backdrop-blur-sm z-10" />
                </div>
            </div>
        </div>
    )
}
