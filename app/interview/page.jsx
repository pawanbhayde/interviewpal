"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    PhoneIcon,
    PlusIcon,
    SendIcon,
    ShareIcon,
    VideoIcon,
    MicIcon,
    BotIcon,
} from "lucide-react";
import useAuth from "@/lib/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import Sentiment from "sentiment";

export default function Component() {
    const [cameraOn, setCameraOn] = useState(false);
    const [sentimentScore, setSentimentScore] = useState(null);
    const videoRef = useRef(null);
    const [pose, setPose] = useState(null);

    const handleCameraToggle = async () => {
        if (cameraOn) {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing the camera: ", err);
            }
        }
        setCameraOn(!cameraOn);
    };

    useEffect(() => {
        const loadPoseDetection = async () => {
            await tf.ready();
            const detectorConfig = {
                modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
            };
            const detector = await posedetection.createDetector(
                posedetection.SupportedModels.MoveNet,
                detectorConfig
            );

            const detectPose = async () => {
                if (videoRef.current) {
                    const poses = await detector.estimatePoses(videoRef.current);
                    if (poses && poses.length > 0) {
                        setPose(poses[0]);
                    }
                    requestAnimationFrame(detectPose);
                }
            };
            detectPose();
        };
        if (cameraOn) {
            loadPoseDetection();
        }
    }, [cameraOn]);

    useEffect(() => {
        const analyzeSentiment = () => {
            const sentiment = new Sentiment();
            const text = "Hey everyone, can you hear me?"; // Replace this with your text source
            const result = sentiment.analyze(text);
            setSentimentScore(result.score);
        };
        analyzeSentiment();
    }, []);

    const router = useRouter();
    const user = useAuth();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <>
            <header className="px-4 lg:px-6 h-[10vh] border-b flex items-center">
                <Link
                    href="/"
                    className="flex gap-2 items-center justify-center"
                    prefetch={false}
                >
                    <BotIcon className="h-6 w-6" />
                    <span className="font-semibold">InterviewPal</span>
                </Link>
                <nav className="ml-auto flex gap-4 items-center sm:gap-6">
                    <Link
                        href="#"
                        className="font-medium hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Features
                    </Link>
                    <Link
                        href="#"
                        className="font-medium hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#"
                        className="font-medium hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        About
                    </Link>
                    <Link
                        href="#"
                        className=" font-medium hover:underline underline-offset-4"
                        prefetch={false}
                    >
                        Contact
                    </Link>
                    {user ? (
                        <>
                            <Link href="/interview">
                                <Button variant="outline">Start Interview</Button>
                            </Link>
                            <Button onClick={handleSignOut}>Sign Out</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signup">
                                <Button variant="secondary">Sign Up</Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button>Sign In</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </header>
            <div className="flex h-[90vh] w-full">
                <div className="flex-1 w-full flex mt-20 justify-center">
                    <div className="flex w-[80vw] lg:w-[70vw] h-[60vh] gap-4">
                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <img
                                src="/aiagent.jpg"
                                alt="Participant"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 rounded-md px-2 py-1 text-white text-sm">
                                John Doe
                            </div>
                        </div>
                        <div
                            id="Camera"
                            className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                        >
                            <video ref={videoRef} autoPlay className="object-cover w-full h-full"></video>
                            <div className="absolute bottom-2 left-2 bg-black/50 rounded-md px-2 py-1 text-white text-sm">
                                Jane Smith
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-80 bg-background border-l">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <div className="text-lg font-medium">Chat</div>
                            <Button variant="ghost" size="icon">
                                <PlusIcon className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <div className="p-4 space-y-4">
                                {sentimentScore !== null && (
                                    <div className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>SA</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1">
                                            <div className="font-medium">Sentiment Analysis</div>
                                            <div className="text-sm text-muted-foreground">
                                                Sentiment Score: {sentimentScore}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {pose && (
                                    <div className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="/placeholder-user.jpg" />
                                            <AvatarFallback>PD</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-1">
                                            <div className="font-medium">Pose Detection</div>
                                            <div className="text-sm text-muted-foreground">
                                                Pose Detected: {JSON.stringify(pose.keypoints)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-t">
                            <Textarea
                                placeholder="Type your message..."
                                className="flex-1 bg-muted rounded-md px-3 py-2 text-sm"
                            />
                            <Button variant="ghost" size="icon">
                                <SendIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-4 py-2 text-white">
                    <Button variant="ghost" size="icon">
                        <MicIcon className="w-6 h-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCameraToggle}
                        className={cameraOn ? "bg-white text-black" : ""}
                    >
                        <VideoIcon className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ShareIcon className="w-6 h-6" />
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-500" size="icon">
                        <PhoneIcon className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </>
    );
}
